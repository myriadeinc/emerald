/* eslint-disable valid-jsdoc */

const crypto = require('crypto');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js');
const cache = require('src/util/cache.js');

const xmrUtils = require('src/util/xmr.js');

const BlockTemplateService = require('src/services/block.template.service.js');

const JobHelperService = {
  /**
     * @description Create a new job based on existing blocktemplate
     * @param {blockTemplate}
     *
     */
  create: (blockTemplate, minerId) => {
    const newJob = {
      minerId: minerId,
      job_id: crypto.pseudoRandomBytes(21).toString('hex'),
      blockHash: blockTemplate.idHash,
      extraNonce: blockTemplate.extraNonce,
      height: blockTemplate.height,
      seed_hash: blockTemplate.seed_hash,
      difficulty: JobHelperService.getVarDiff(minerId, blockTemplate),
      
    };
    const jobReply = {
      height: newJob.height,
      blob: blockTemplate.blob,
      job_id: newJob.job_id,
       /**
     * @todo: add proper conversion from diff to target
     */
      target: newJob.difficulty.toString(16),
      seed_hash: newJob.seed_hash,
    };
    return cache.put(newJob.id, newJob, 'job')
        .then(() => {
          return jobReply;
        });
  },


  getVarDiff: (minerId, blockTemplate) => {
  // Need to add real variable difficulty calculator
    return 10;
   // return blockTemplate.difficulty;
  },
  /**
     * @todo: add proper method
     */
  getFromId: (id) => {
    let job;
    return cache.get(id, namespace='job')
        .then((res) => {
          job = res;
          return job;
        })
        .catch((err) => {
          logger.core.error(`Error hitting cache with job::${id} ; ${err}`);
          return err;
        })
        
  },

};
module.exports = JobHelperService;
