/* eslint-disable valid-jsdoc */

const crypto = require('crypto');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js');

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
      id: crypto.pseudoRandomBytes(21).toString('base64'),
      blockHash: blockTemplate.idHash,
      extraNonce: blockTemplate.extraNonce,
      height: blockTemplate.height,
      seed_hash: blockTemplate.seed_hash,
      difficulty: JobHelperService.getVarDiff(minerId, blockTemplate),
    };
    const jobReply = {
      job_id: newJob.id,
      blob: BlockTemplateService.getBlob(),
      /**
     * @todo: add proper conversion from diff to target
     */
      target: difficulty.toString('hex'),
    };
    return cache.put(newJob.id, newJob, 'job')
        .then(() => {
          return jobReply;
        });
  },


  getVarDiff: (minerId, blockTemplate) => {
  // Need to add real variable difficulty calculator
    return blockTemplate.difficulty;
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
          uid = crypto.pseudoRandomBytes(21).toString('base64'); // Generate a new UID
          logger.core.error(`Error hitting cache with job::${id} ; ${err}`);
          const blockTemplate = BlockTemplateService.getBlockTemplate();
          job = {
            id: uid,
            extraNonce: blockTemplate.extraNonce,
            height: blockTemplate.height,
            difficulty: JobHelperService.getVarDiff(id, blockTemplate),
          };
          return cache.put(uid, job, namespace='job');
        })
        .then(() => {
          return job;
        });
  },

};
module.exports = JobHelperService;
