'use strict';
const bignum = require('bignum');
const xmr = require('src/util/xmr.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockReference;


// Value is 16^64 or 2^256
const baseDiff = bignum('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16)

const BlockReferenceService = {
  // Checks if block sent by miner corresponds to the job they were assigned
  verifyBlock: (minerData, job) => {
    try {
      let block = BlockReferenceService.buildBlock(job.blob, minerData.nonce, job.extraNonce);
      block = BlockReferenceService.convertBlock(block);
      block = BlockReferenceService.hashBlock(block, job.seed_hash);
      return block.toString('hex') == minerData.result;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  // For fallback:
  // new Buffer(minerData.nonce, 'hex').copy(block, 39);
  // Writing the nonce in a specific position if util does not work in testing

  buildBlock: (blob, nonce, extraNonce) => {
    let block = Buffer.from(blob, "hex");
    // Value of 8 is given because our default reserve_offset is set to 8
    block.writeUInt32BE(extraNonce, 8);
    const NonceBuffer = Buffer.from(nonce, 'hex');
    return xmr.construct_block_blob(block, NonceBuffer);
  },
  // Used when our nonce is represented as an integer value 
  buildIntNonce: (blob, nonce) => {
    let block = Buffer.from(blob, "hex");
    const buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(nonce);
    const NonceBuffer = buf;
    return xmr.construct_block_blob(block, NonceBuffer);
  },
  convertBlock: (constructedBlock) => {
    return xmr.convert_blob(constructedBlock);
  },
  hashBlock: (block, seed_hash) => {
    return xmr.randomx(block, Buffer.from(seed_hash, 'hex'));
  },
  checkDifficulty: (localDiff, globalDiff, block) => {
    // Add some metrics, 200k check
    const benchmarkDiff = 200000n
    // Why are we using bignum library instead of native BigInt here? 
    // Proper division (because of hex data) only works as expected via loading raw Buffers
    let rawBlock = Buffer.from(block, 'hex');
    rawBlock = Array.prototype.slice.call(rawBlock, 0).reverse();
    const hashNum = bignum.fromBuffer(Buffer.from(rawBlock));
    let hashDiff = baseDiff.div(hashNum);

    hashDiff = BigInt(hashDiff)
    globalDiff = BigInt(globalDiff);
    localDiff = BigInt(localDiff);

    console.log(`Share of ${hashDiff}`)

    if (hashDiff >= globalDiff) {

      // We won the block reward!
      // Submit to monero node
      return 2;
    }
    if (hashDiff >= localDiff) {
      if(hashDiff >= benchmarkDiff) {logger.info(`Found big diff block ${hashDiff} surpassing ${benchmarkDiff}`)}
      // Grant share to miner
      return 1;
    }
    // Block does not match difficulty requirements: low difficulty share
    return 0;
  },


};

module.exports = BlockReferenceService;


