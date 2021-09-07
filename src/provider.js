const Web3 = require('web3');

const chainId = process.env.DEFAULT_CHAIN_ID ?? '1';
const jsonRpcUrls = JSON.parse(process.env.JSON_RPC_URLS);

module.exports = new Web3.providers.HttpProvider(jsonRpcUrls[chainId]);

module.exports.createNetworkProvider = ({ url, chainId }) => {
  return new Web3.providers.HttpProvider(url || jsonRpcUrls[chainId]);
};
