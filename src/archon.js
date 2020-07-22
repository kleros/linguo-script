const Archon = require('@kleros/archon');
const provider = require('./provider');

const ipfsHostAddress = process.env.IPFS_HOST_ADDRESS || 'http://localhost:5001';

module.exports = new Archon(provider, ipfsHostAddress);
