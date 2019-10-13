const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockTemplate;

const previousOffset = 7; // Legacy hard coded from cryptonote

const cryptonoteUtils = require('src/util/cryptonote.js')

class BlockTemplate {
    
    /**
     * Pseudo copy ctor
     * @description Constructs a Block template object from the json data from the RPC daemon
     * @param {object} template : template o
     * @param {boolean} randomX 
     */
    constructor(data){
        try{
          
            this.difficulty = data.difficulty;
            this.blob = data.blocktemplate_blob;
            this.height = data.height;
            this.reservedOffset = data.reserved_offset;
            this.previousHash = data.prev_hash

            this.buffer = Buffer.from(this.blob, 'hex');
            cryptonoteUtils.instanceId.copy(this.buffer, this.reservedOffset + 4, 0, 3);
            this.previous_hash = Buffer.alloc(32);
            this.buffer.copy(this.previousHash, 0, previousOffset, 39);
            this.extraNonce = 0;
        }
        catch(e){
            logger.error(e);
            throw err.instantiation;
        }
    }


    nextBlob(){
        this.buffer.writeUInt32BE(++this.extraNonce, this.reservedOffset);
        return cryptonoteUtils.cnUtil.convert_blob(this.buffer, config.get('pool:cryptonight:blobType')).toString('hex');
    }

    nextBlobWithChildNonce(){
        // Write a 32 bit integer, big-endian style to the 0 byte of the reserve offset.
        this.buffer.writeUInt32BE(++this.extraNonce, this.reservedOffset);
        // Don't convert the blob to something hashable. 
        return this.buffer.toString('hex');
    }

}

module.exports = BlockTemplate;
