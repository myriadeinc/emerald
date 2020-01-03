/* eslint-disable require-jsdoc */
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockTemplate;

const reserveOffset = config.get('pool:reserveSize') || 8;

const xmrUtil = require('src/util/xmr.js');

class BlockTemplate {
  constructor(data) {
    try {
      this.difficulty = data.difficulty;
      this.blob = data.blockhashing_blob;
      this.height = data.height;
      this.seed_hash = data.seed_hash;
      this.reservedOffset = data.reserved_offset;
      this.previousHash = data.prev_hash;
      this.expectedReward = data.expectedReward;
      // This is only if for some reason the prev_hash field does not exist, ignore until refactor
      // this.previous_hash = Buffer.alloc(32);
      // this.buffer.copy(this.previousHash, 0, previousOffset, 39);
    } catch (e) {
      logger.error(e);
      throw err.instantiation;
    }
  }

  getBlob() {
    const buffer = new Buffer(this.blob, 'hex');
    // We start the extraNonce at 1 as the original code effectively writes 1
    buffer.writeUInt32BE(1, reserveOffset);
    return xmrUtil.convert_blob(buffer).toString('hex');
  }
  /* Note:
    This function is only used for miner proxies
    It does not seem to be explicitly supported in Monero
    Left until further refactor is needed
    nextBlobWithChildNonce(){
        // Write a 32 bit integer, big-endian style to the 0 byte of the reserve offset.
        this.buffer.writeUInt32BE(++this.extraNonce, this.reservedOffset);
        // Don't convert the blob to something hashable.
        return this.buffer.toString('hex');
    }
    */
}

module.exports = BlockTemplate;
