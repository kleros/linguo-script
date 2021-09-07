const Archon = require('@kleros/archon');
const provider = require('./provider');

const ipfsGateway = process.env.IPFS_GATEWAY_ADDRESS || 'https://ipfs.io';

module.exports = new Archon(provider, ipfsGateway);
