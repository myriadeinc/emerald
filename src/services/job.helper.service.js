/* eslint-disable valid-jsdoc */

const crypto = require('crypto');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js');
const cache = require('src/util/cache.js');

const xmrUtils = require('src/util/xmr.js');

const BlockTemplateService = require('src/services/block.template.service.js');
// baseDiff = 2^256
const baseDiff = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
// 20k is a reasonable minimum difficulty based on hashrate for low-end CPUs
const minDiff = BigInt(20000);
const JobHelperService = {
  /**
     * @description Create a new job based on existing blocktemplate
     * @param {blockTemplate}
     *
     */
  create: (blockTemplate, minerId) => {
    const diff = JobHelperService.getVarDiff(minerId, blockTemplate);
    const newJob = {
      minerId: minerId,
      job_id: crypto.pseudoRandomBytes(21).toString('hex'),
      blockHash: blockTemplate.blob,
      extraNonce: 5,//crypto.pseudoRandomBytes(4).readUInt32BE(0, true),
      height: blockTemplate.height,
      seed_hash: blockTemplate.seed_hash,
      blockBlob: blockTemplate.templateBlob,
      // Diff hardcoded for now
      difficulty: diff.toString()
    };
    const jobReply = {
      height: newJob.height,
      blob: blockTemplate.blob,
      job_id: newJob.job_id,
      id: minerId,
       /**
     * @todo: add proper conversion from diff to target
     */
      target: JobHelperService.getTargetHex(diff),
      seed_hash: newJob.seed_hash,
      algo: "rx/0"
    };
    return cache.put(newJob.job_id, newJob, 'job')
        .then((result) => {
          return jobReply;
        });
  },

  // Add proper blob creation
  createBlob: (blob) => {
    return blob;
  },
  getTargetHex: (difficulty) => {
            difficulty = BigInt(difficulty);
            let difficultyBuffer = Buffer.alloc(32);

            let quotient = Buffer.from((baseDiff/difficulty).toString(16),'hex');
            quotient.copy(difficultyBuffer, 32 - quotient.length);

            let buff = difficultyBuffer.slice(0, 4);
            let buffReversed = Buffer.from(Array.prototype.slice.call(buff).reverse());
            return buffReversed.toString('hex');
  },

  getVarDiff: (minerId, blockTemplate) => {
  // Need to add real variable difficulty calculator
    return minDiff;
  //return blockTemplate.difficulty;
   
  },
  /**
     * @todo: add proper method
     */
  getFromId: async (id) => {
    return cache.get(id,'job')
        .then((job) => {
          return job;
        })
        .catch((err) => {
          logger.core.error(`Error hitting cache with job::${id} ; ${err}`);
          return err;
        })
        
  },

};
module.exports = JobHelperService;
