const config = require('src/util/config.js');
const logger = require('src/util/logger.js').block;
const err = require('src/util/error.js').BlockReference;

const xmrUtil = require('cryptoforknote-util');
const multiHashing = require('cryptonight-hashing');

const BlockTemplateService = require('src/services/block.template.service.js');
const JobHelperService = require('src/services/job.helper.service.js');

/**
 * @Note
 * @description
 * This model was created to separate the block processing logic from miner model
 * 
 */
const BlockReferenceService = {
    buildBlock: (minerData, job) => {
        try{
            let blockTemplate = BlockTemplateService.getBlockTemplate();
            const job = JobHelperService.getFromId(minerData.job_id);

            let block = new Buffer(blockTemplate.buffer.length);
            blockTemplate.buffer.copy(block);
            // Write the extra nonce first, then the regular nonce
            block.writeUInt32BE(job.extraNonce, blockTemplate.reserveOffset);
            /* 
            For fallback:
            new Buffer(minerData.nonce, 'hex').copy(block, 39);
            Writing the nonce in a specific position if util does not work in testing
            */
            const randomXid = 1;
            const NonceBuffer = new Buffer(minerData.nonce,'hex');
            return xmrUtil.construct_block_blob(blockTemplate, NonceBuffer, randomXid);
        }
        catch(e){
            logger.error(e);
            throw err.instantiation;
        }
    },
    checkBlock: (block, result) => {
        const blockHashed = xmrUtil.hash(block, "randomx");
        
        if(blockHashed.toString('hex') !== minerdata.result){
            logger("Bad Hash!!!1");
            return false;
        }

        return true;

    },

    checkDifficulty: (difficulty, blockHashed) => {
        var hashArray = blockHashed.toJSON().reverse();

        // Diff is a reference from bignum 
        var hashDiff = diff.div(bignum.fromBuffer(new Buffer(hashArray)));
    
        if (hashDiff.ge(blockTemplate.difficulty)){
            moneroApi.submit(block, function(error, result){
                if (error){
                    sapphireApi.sendShareInfo();
                    resolve("MONERO API ERROR");
                    return false;
                }
                else{
                    var blockFastHash = cryptoNightFast(convertedBlob || cryptoNoteUtils.cnUtil.convert_blob(block)).toString('hex');
                    // Send blockfasthash instead
                    sapphireApi.sendShareInfo();                        
                    jobRefresh();
                    resolve("Share Granted");
                    return true;
                }
            });
        }
    
        else if (hashDiff.lt(job.difficulty)){
            // Miner sent bad block/nonce, this is a bannable offense since XMRig should not be sending any below target difficulty
            sapphireApi.sendShareInfo();
            return false;
        }

    },



};

module.exports = BlockReferenceService;