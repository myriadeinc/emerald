import {exec} from 'child_process';

const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockReference;
const cryptonoteUtils = require('src/util/cryptonote.js')

/**
 * @Note
 * @description
 * This model was created to separate the block processing logic from miner model
 * 
 */
class BlockReference {
    block = null;
    /**
     * 
     * @description Constructs a Block Reference
     * @param {object} blockTemplate
     * @param {boolean} randomX 
     */
    constructor(blockTemplate, minerData, job){
        try{
            this.block = new Buffer(blockTemplate.buffer.length);
            blockTemplate.buffer.copy(this.block);
            this.block.writeUInt32BE(job.extraNonce, blockTemplate.reserveOffset);
            new Buffer(minerData.nonce, 'hex').copy(block, 39);
            return block;
        }
        catch(e){
            logger.error(e);
            throw err.instantiation;
        }
    }

    compare(nonce){


    }



}

export default Blockreference;