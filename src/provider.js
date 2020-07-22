const Web3 = require('web3');

const chainId = process.env.CHAIN_ID ?? '1';
const infuraApiKey = process.env.INFURA_API_KEY;

const subdomainByChainId = {
  1: 'mainnet.',
  42: 'kovan.',
};

const subdomain = subdomainByChainId[chainId];

const providerUrl = `https://${subdomain}infura.io/v3/${infuraApiKey}`;

module.exports = new Web3.providers.HttpProvider(providerUrl);
