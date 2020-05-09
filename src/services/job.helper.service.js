/* eslint-disable valid-jsdoc */
const crypto = require('crypto');
const logger = require('src/util/logger.js');
const cache = require('src/util/cache.js');
const xmrUtil = require('cryptoforknote-util');
const config = require('src/util/config.js');


const BlockTemplateService = require('src/services/block.template.service.js');
// baseDiff = 2^256
const baseDiff = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
// Reserved offset should be changed later, default is 8
const reserveOffset = 8;
// 10k is a reasonable minimum difficulty based on hashrate for low-end CPUs, the represented number on the client will be different
const minDiff = config.get('pool:diff') || BigInt(10000);
const JobHelperService = {
  /**
     * @description Create a new job based on existing blocktemplate
     * @param {blockTemplate}
     *
     */
  create: async (blockTemplate, minerId) => {
    const diff = minDiff;
    const extraNonce = JobHelperService.getExtraNonce();
    const newJob = {
      minerId: minerId,
      job_id: crypto.pseudoRandomBytes(21).toString('hex'),
      extraNonce: extraNonce,
      height: blockTemplate.height,
      seed_hash: blockTemplate.seed_hash,
      blob: blockTemplate.templateBlob,
      globalDiff: blockTemplate.difficulty.toString(),
      // Cannot use BigInt in Redis!
      difficulty: diff.toString()
    };
    if (!newJob.blob) {
      logger.core.info("Blob missing!");
    }

    // Job construction is partially replicated because of different fields that require writing to the binary blob
    const jobReply = JobHelperService.createStratumJob(newJob, minerId, diff);

    await cache.put(newJob.job_id, newJob, 'job');
    return jobReply;
  },
  createStratumJob: (newJob, minerId, diff) => {
    return {
      height: newJob.height,
      blob: JobHelperService.createBlob(newJob.blob, newJob.extraNonce),
      job_id: newJob.job_id,
      id: minerId,
      target: JobHelperService.getTargetHex(diff),
      seed_hash: newJob.seed_hash,
      algo: "rx/0"
    };
  },

  getExtraNonce: () => {
    // Randomly generated for now, should later be based on uuid + deterministic factors
    return crypto.pseudoRandomBytes(4).readUInt32BE(0, true);
  },
  /**
   * @param {string} blob Blocktemplate blob represented as a hex string
   * @param extraNonce 32 bit int 
   */
  createBlob: (blob, extraNonce) => {
    const newBlob = Buffer.from(blob, "hex");
    newBlob.writeUInt32BE(extraNonce, reserveOffset);
    return xmrUtil.convert_blob(newBlob).toString("hex");
  },
  getTargetHex: (difficulty) => {
    // We are translating the difficulty, which is an integer representation of the required nonce condition, to a hexadecimal representation format
    difficulty = BigInt(difficulty);
    let difficultyBuffer = Buffer.alloc(32);
    let quotient = Buffer.from((baseDiff / difficulty).toString(16), 'hex');
    quotient.copy(difficultyBuffer, 32 - quotient.length);
    let buff = difficultyBuffer.slice(0, 4);
    let buffReversed = Buffer.from(Array.prototype.slice.call(buff).reverse());
    return buffReversed.toString('hex');
  },

  getVarDiff: (minerId, blockTemplate) => {
    // Need to add real variable difficulty calculator, currently using a static difficulty for all miners
    return minDiff;
  },

  getFromId: async (id) => {
    return cache.get(id, 'job')
      .then(job => {
        return job;
      })
      .catch(err => {
        logger.core.error(`Error hitting cache with job::${id} ; ${err}`);
        return err;
      });
  },

};
module.exports = JobHelperService;
