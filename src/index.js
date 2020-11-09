const Linguo = require('@kleros/linguo-contracts/artifacts/Linguo.json');
const Web3 = require('web3');
const { getTaskUrl, getTaskId } = require('./linguo');
const provider = require('./provider');
const promiseRetry = require('./promiseRetry');

module.exports = getMetaEvidence;

const web3 = new Web3(provider);

async function getMetaEvidence() {
  const { arbitrableContractAddress, disputeID } = scriptParameters;

  if (!arbitrableContractAddress || !disputeID) {
    resolveScript({});
  }

  try {
    resolveScript(await getAdditionalData({ arbitrableContractAddress, disputeID }));
  } catch (err) {
    rejectScript(err.message);
  }
}

async function getAdditionalData({ arbitrableContractAddress, disputeID }) {
  const linguoContract = new web3.eth.Contract(Linguo.abi, arbitrableContractAddress);

  const { taskID, requester, translator, challenger } = await _tryGetDataFromContract(linguoContract, {
    arbitrableContractAddress,
    disputeID,
  });

  return {
    aliases: {
      [requester]: 'Requester',
      [translator]: 'Translator',
      [challenger]: 'Challenger',
    },
    arbitrableInterfaceURI: getTaskUrl({
      contractAddress: arbitrableContractAddress,
      id: taskID,
    }),
    arbitrableInterfaceMetadata: {
      arbitrableID: getTaskId({
        contractAddress: arbitrableContractAddress,
        id: taskID,
      }),
    },
  };
}

async function _tryGetDataFromContract(contract, { disputeID }) {
  const taskID = await contract.methods.disputeIDtoTaskID(disputeID).call();

  const disputeEvents = await _getPastEvents(contract, 'Dispute', {
    filter: { _disputeID: disputeID },
    fromBlock: 0,
  });

  if (disputeEvents.length === 0) {
    throw new Error('Invalid dispute');
  }

  const taskIDFromEvent = disputeEvents[0]?.returnValues?._metaEvidenceID;

  if (taskID !== taskIDFromEvent) {
    throw new Error('Invalid dispute');
  }

  const [taskCreatedEvents, translationChallengedEvents] = await Promise.all([
    _getPastEvents(contract, 'TaskCreated', {
      filter: { _taskID: taskID },
      fromBlock: 0,
    }),
    _getPastEvents(contract, 'TranslationChallenged', {
      filter: { _taskID: taskID },
      fromBlock: 0,
    }),
  ]);

  if (taskCreatedEvents.length === 0 || translationChallengedEvents.length === 0) {
    throw new Error('Invalid dispute');
  }

  const requester = taskCreatedEvents[0]?.returnValues?._requester;

  const [_ignored, translator, challenger] = await contract.methods.getTaskParties(taskID).call();

  return {
    taskID,
    requester,
    translator,
    challenger,
  };
}

async function _getPastEvents(contract, eventName, { filter, fromBlock = 0, toBlock = 'latest' } = {}) {
  return promiseRetry(
    contract
      .getPastEvents(eventName, {
        fromBlock,
        toBlock,
        filter,
      })
      .then(events => {
        if (events.some(({ event }) => event === undefined)) {
          console.warn('Failed to get log values for event', { eventName, filter, events });
          throw new Error('Failed to get log values for event');
        }

        return events;
      }),
    {
      maxAttempts: 5,
      delay: count => 500 + count * 1000,
      shouldRetry: err => err.message === 'Failed to get log values for event',
    }
  );
}
