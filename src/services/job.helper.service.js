
const crypto = require('crypto');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js')

const xmrUtils = require('src/util/cryptonote.js');

const JobHelperService = {

    /**
     * @description Create a new job based on existing blocktemplate
     * @param {blockTemplate}
     * 
     */
    create: (blockTemplate) => {
        const newJob = {
            id:                  crypto.pseudoRandomBytes(21).toString('base64'),
            blockHash:           blockTemplate.idHash,
            extraNonce:          blockTemplate.extraNonce,
            height:              blockTemplate.height,
            seed_hash:           blockTemplate.seed_hash,
            difficulty:          blockTemplate.difficulty,
        }
        const jobReply = {
                job_id: newJob.id,
                blob: BlockTemplateService.getBlob(),
                /**
                 * @todo: add proper conversion from diff to target
                 */
                target: difficulty.toString('hex'),
        }
        cache.put(newJob.id,newJob,"job");
        return jobReply;
    },

    /**
     * @todo: add proper method
     */
    getFromId: (id) => {
        return cache.get(`job::${id}`).toJSON();
    }

}
module.exports = JobHelperService;