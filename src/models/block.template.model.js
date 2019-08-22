import {exec} from 'child_process';

const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockTemplate;

const cryptonoteUtils = require('src/util/cryptonote.js')

class BlockTemplate {
    
    blob = null;
    difficulty = null;
    isRandomX = false;
    seed_hash = null;
    next_seed_hash = null;
    /**
     * Pseudo copy ctor
     * @description Constructs a Block template object from the json data from the RPC daemon
     * @param {object} template : template o
     * @param {boolean} randomX 
     */
    constructor(data){
        try{
            this.isRandomX = config.get('pool:randomX');
            this.difficulty = data.difficulty;
            this.blob = data.blocktemplate_blob;
            if (this.isRandomX){
                this.seed_hash = data.seed_hash;
                this.next_seed_hash = data.next_seed_hash;
            }
            this.reserveOffset = data.reserved_offset;
            this.buffer = Buffer.from(this.blob, 'hex');
            cryptonoteUtils.instanceId.copy(this.buffer, this.reserveOffset + 4, 0, 3);
            this.previous_hash = Buffer.alloc(32);
            this.buffer.copy(this.previous_hash, 0, previousOffset, 39);
            this.extraNonce = 0;

            // The clientNonceLocation is the location at which the client pools should set the nonces for each of their clients.
            this.clientNonceLocation = this.reserveOffset + 12;
            // The clientPoolLocation is for multi-thread/multi-server pools to handle the nonce for each of their tiers.
            this.clientPoolLocation = this.reserveOffset + 8;
        }
        catch(e){
            logger.error(e);
            throw err.instantiation;
        }
    }


    nextBlob(){
        this.buffer.writeUInt32BE(++this.extraNonce, this.reserveOffset);
        return cryptonoteUtils.cnUtil.convert_blob(this.buffer, config.get('pool:cryptonight:blobType')).toString('hex');
    }

    nextBlobWithChildNonce(){
        // Write a 32 bit integer, big-endian style to the 0 byte of the reserve offset.
        this.buffer.writeUInt32BE(++this.extraNonce, this.reserveOffset);
        // Don't convert the blob to something hashable.  You bad.
        return this.buffer.toString('hex');
    }

}

export default BlockTemplate;