'use strict';

const logger = require('src/util/logger.js').miner;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const BlockReferenceService = require('src/services/block.reference.service.js');

const BlockTemplateService = require('src/services/block.template.service.js');
const MinerModel = require('src/models/miner.model.js');

const JobHelperService = require('src/services/job.helper.service.js');

const cache = require('src/util/cache.js');
const config = require('src/util/config.js');

const debug = true;

const MinerService = {
  // Test function
  paramDump: (params) => {
    return params;
  },

  login: (params) => {
    const login = params.login;
    const pass = params.pass;

    return new Promise((resolve,reject) => {
      //  DO NOT REMOVE
      // After discussion, since XMRrig sends insecure TCP requests, we will not
      //  be requesting the actual Diamond password (since exposing that password will 
      //  effectively compromise all of our back-end service). Since there is low risk and no
      //  incentive for anyone to impersonate another miner, we will use Miner Address as login and
      //  their miner Id as pass.

      const miner = new MinerModel({
        address: login,
        id: pass,
      });

      return miner.getJob().then((result)=>{
        const responseBody = {
          id: miner.id,
          job: result,
          status: "OK"
        };
        if(!responseBody.job){
          logger.error("Job not found! " + result);
        }

        resolve(responseBody);
        
      }).catch((err) => {
        logger.error(err);
        reject(Error('Login failed'));
      });
    }); 
  },
  

 submit: (params) => {
  return new Promise((resolve, reject) => {
    // Load miner by id
    // MinerModel.submit(data)

    return MinerService.submitProxy(params)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      logger.error(err);
      reject(err);
    });
  });
 
},


// This is very bad code, must rewrite!
submitProxy: async (data) => {
  const minerData = {
    id: data.id,
    job_id: data.job_id,
    nonce: data.nonce,
    result: data.result,
  };
  const job = await JobHelperService.getFromId(minerData.job_id);

  // Fetch our version of the miner's block and build it
  const block = BlockReferenceService.buildBlockFromBase(minerData, job);
  // Convert into actual cryptonight format
  const block2 = BlockReferenceService.convertBlock(block);
  const r = BlockReferenceService.hashBlock(block2, job.seed_hash);
  const finalHash = r.toString('hex');
  let dump = data;
  dump.timestamp = Date.now();
  logger.info(data);
  console.dir(data);
  
  if(finalHash == minerData.result){
    if(BlockReferenceService.checkDifficulty(job.difficulty, finalHash, job)){
      return {status: "ok"};
    }
  }
    return {error: "invalid share"}
},

  
  keepalived: (params) => {
    return new Promise((resolve, reject) => {
      resolve({
        status: 'KEEPALIVED',
      });
    });
  },



};

module.exports = MinerService;
