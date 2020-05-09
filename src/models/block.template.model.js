/* eslint-disable require-jsdoc */
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockTemplate;

const reserveOffset = config.get('pool:reserveSize') || 8;

const xmrUtil = require('src/util/xmr.js');

class BlockTemplate {
  constructor(data) {
    if (data.error) {
      logger.error('Error in fetching block template, check monero daemon')
      throw err.instantiation;
    }
    try {
      this.difficulty = data.difficulty;
      this.blob = data.blockhashing_blob;
      this.templateBlob = data.blocktemplate_blob;
      this.height = data.height;
      this.seed_hash = data.seed_hash;
      this.reservedOffset = data.reserved_offset;
      this.previousHash = data.prev_hash;
      // This is only if for some reason the prev_hash field does not exist, ignore until refactor
      // this.previous_hash = Buffer.alloc(32);
      // this.buffer.copy(this.previousHash, 0, previousOffset, 39);
    } catch (e) {
      logger.error(e);
      throw err.instantiation;
    }
  }

  getBlob() {
    // We write the reserve offset into the block template, then construct it using the native tools
    const buffer = Buffer.from(this.blob, 'hex');
    // We start the extraNonce at 1 as the original code effectively writes 1
    buffer.writeUInt32BE(1, reserveOffset);
    return xmrUtil.convert_blob(buffer).toString('hex');
  }
}

module.exports = BlockTemplate;
