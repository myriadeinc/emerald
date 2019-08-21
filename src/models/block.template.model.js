import {exec} from 'child_process';

const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;

class BlockTemplate {
    
    blob = null;
    difficulty = null;
    isRandomX = true;
    seed_hash = null;
    next_seed_hash = null;
    /**
     * Pseudo copy ctor
     * @description Constructs a Block template object from the json data from the RPC daemon
     * @param {object} template : template o
     * @param {boolean} randomX 
     */
    constructor(data, randomX=true){
        try{
            this.isRandomX = randomX;
            this.difficulty = data.difficulty;
            this.blob = data.blocktemplate_blob;
            if (this.isRandomX){
                this.seed_hash = data.seed_hash;
                this.next_seed_hash = data.next_seed_hash;
            }
            this.reserveOffset = data.reserved_offset;
            this.buffer = Buffer.from(this.blob, 'hex');
            instanceId.copy(this.buffer, this.reserveOffset + 4, 0, 3);
            this.previous_hash = Buffer.alloc(32);
            this.buffer.copy(this.previous_hash, 0, previousOffset, 39);
            this.extraNonce = 0;

            // The clientNonceLocation is the location at which the client pools should set the nonces for each of their clients.
            this.clientNonceLocation = this.reserveOffset + 12;
            // The clientPoolLocation is for multi-thread/multi-server pools to handle the nonce for each of their tiers.
            this.clientPoolLocation = this.reserveOffset + 8;
        }
        catch(e){

        }
        
    }

}

export default BlockTemplate;