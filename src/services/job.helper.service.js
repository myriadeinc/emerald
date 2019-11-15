
const crypto = require('crypto');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js')

const xmrUtils = require('src/util/xmr.js');

const BlockTemplateService = require('src/services/block.template.service.js');

const BlockTemplateService = require('src/services/block.template.service.js');

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
        return cache.put(newJob.id,newJob,"job")
        .then(() => {
            return jobReply;
        })
        
    },

    /**
     * @todo: add proper method
     */
    getFromId: (id) => {
        let job;
        return cache.get(id, namespace='job')
        .then(res => {
            job = res;
            return job;
        })
        .catch(err => {
            uid = '12345'; // Generate a new UID
            logger.core.error(`Error hitting cache with job::${id} ; ${err}`);
            let blockTemplate = BlockTemplateService.getBlockTemplate();
            job = {
                id: crypto.pseudoRandomBytes(21).toString('base64'),
                extraNonce: blockTemplate.extraNonce,
                height: blockTemplate.height,
                difficulty: getCurrentDifficulty(),
                score: getCurrentScore(),
                diffHex: getDiffHex(),
                submissions: []
            };
            return cache.put(uid, job, namespace="job")
        })
        .then(() => {
            return job
        })
    }

}
module.exports = JobHelperService;