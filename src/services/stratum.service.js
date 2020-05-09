'use strict';
const logger = require('src/util/logger.js').miner;

const BlockReferenceService = require('src/services/block.reference.service.js');
const BlockTemplateService = require('src/services/block.template.service.js');

const JobHelperService = require('src/services/job.helper.service.js');

const SapphireApi = require('src/api/sapphire.api.js');
const MoneroApi = require('src/api/monero.api.js');

const config = require('src/util/config.js');

const useSapphire = config.get('nobridge') ? false : true;

const sendWinner = (block) => {
  MoneroApi.submit(block)
    .then(res => {
      logger.info(res);
      return true
      // We would have to refresh/fetch new job based on the monero daemon api response
    })
    .catch(err => {
      logger.error(err);
      return err;
    });

};
const sendShare = (job) => {
  const sapphirePayload = {
    minerId: job.minerId,
    shares: 1, // We can modify this later for 'mining boosts'
    difficulty: job.difficulty,
    timestamp: Date.now(),
    blockHeight: job.height
  }
  SapphireApi.sendShareInfo(sapphirePayload);
  return true;
}

const StratumService = {

  // Test function, this will never be called from the mining client xmrig
  dump: (params) => {
    logger.info(params);
    return { status: 'ok' }
  },

  login: async (params) => {
    logger.debug(JSON.stringify(params))
    
    const minerId = params.login;
    //  DO NOT REMOVE
    // After discussion, since XMRrig sends insecure TCP requests, we will not
    //  be requesting the actual Diamond password (since exposing that password will 
    //  effectively compromise all of our back-end service). Since there is low risk and no
    //  incentive for anyone to impersonate another miner, we will use Miner uuid as login 
    const job = await StratumService.job(minerId);
    return {
      id: minerId,
      job,
      status: 'OK'
    }
  },
  proxyjob: async (loginData) => {
    const minerId = params.login;
    const job = await StratumService.job(minerId);
    return job
  },
  job: async (minerId) => {
    const block = await BlockTemplateService.getBlockTemplate();
    const job = await JobHelperService.create(block, minerId);
    return job;
  },
  // If we refactor this in the future, it is a top priority
  submit: async (params) => {
    const job = await JobHelperService.getFromId(params.job_id);
    const minerData = {
      minerId: params.id,
      job_id: params.job_id,
      nonce: params.nonce,
      result: params.result,
    };
    const status = await BlockReferenceService.checkDifficulty(job.difficulty, job.globalDiff, minerData.result);
    if (status) {
      const isValid = await BlockReferenceService.verifyBlock(minerData, job);
      if (status == 2 && isValid) {
        logger.info('We won the block reward!');
        try {
          sendWinner(minerData.result)
        }
        catch (e) {
          logger.error(e)
        }
        ;
      }
      if (isValid && useSapphire) {
        try {
          sendShare(job);
        }
        catch (e) {
          logger.error(e)
        }
        return { status: 'OK' }
      }
    }

    return {
      error: {
        code: -1,
        message: "Low difficulty or bad share"
      }
    };
  },

  // This method should not be used as we don't maintain live TCP connections
  keepalived: (params) => {
    return { status: 'KEEPALIVED'}
  },

};

module.exports = StratumService;
