const randomxUtil = require('cryptonote-lib');
const blockUtil = require('cryptonight-hashing');
const bignum = require('bignum');

const xmr = {
/**
 * bignum for checking difficulty
 */
  diff:
bignum('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16),


  /**
 * @param {Buffer} buffer
 * @param {Buffer} nonceData
 * @return {Buffer} Block in raw bytes (Buffer object)
 */
  construct_block_blob: (buffer, nonceData) => {
    return blockUtil.construct_block_blob(buffer, nonceData, 0);
  },

  /**
 * @param {Buffer} blob The block in raw bytes
 * @param {Buffer} seed_hash The seed_hash for randomx in raw bytes
 * @return {Buffer} Hashed block in raw bytes (Buffer object), must convert to hex string
 * @Doc We use the constant 0 to sepcify Monero's randomx configuration
 */
  randomx: (blob, seed_hash) => {
    return randomxUtil(blob, seed_hash, 0);
  },

};

module.exports = xmr;
