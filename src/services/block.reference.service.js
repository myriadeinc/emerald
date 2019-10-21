const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockReference;
const xmrUtils = require('src/util/cryptonote.js')
const blockTemplateService = require('src/services/block.template.service.js');


/**
 * @Note
 * @description
 * This model was created to separate the block processing logic from miner model
 * 
 */
const BlockReferenceService = {
    buildBlock: (minerData, job) => {
        try{

            var job = jobHelperService.getFromId(minerData.job_id);


            var block = new Buffer(blockTemplate.buffer.length);
            blockTemplate.buffer.copy(this.block);
            this.block.writeUInt32BE(job.extraNonce, blockTemplate.reserveOffset);
            new Buffer(minerData.nonce, 'hex').copy(block, 39);
            return block;
        }
        catch(e){
            logger.error(e);
            throw err.instantiation;
        }
    },
    checkBlock: (block, result) => {
        const blockHashed = xmrUtils.hash(block, "randomx");
        
        if(blockHashed.toString('hex') !== minerdata.result){
            logger("Bad Hash!!!1");
            return false;
        }

        return true;

    },

    checkDifficulty: (difficulty, blockHashed) => {


    },

    getVerifiedBlock: () => {
        return null;
    },




};

module.exports = BlockReferenceService;