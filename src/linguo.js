module.exports = {
  getTaskUrl,
  getTaskId,
};

const linguoInterfaceBaseUrl = (process.env.LINGUO_INTERFACE_BASE_URL ?? 'https://linguo.kleros.io').replace(
  /\/+$/,
  ''
);

function getTaskUrl({ contractAddress, id }) {
  return `${linguoInterfaceBaseUrl}/translation/${contractAddress}/${id}`;
}

function getTaskId({ contractAddress, id }) {
  return `${contractAddress}/${id}`;
}
