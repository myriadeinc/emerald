const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const xmr = require('src/util/xmr.js');
const err = require('src/util/error.js');
const _ = require('lodash');
const globals = require('src/util/global.js');
const cache = require('src/util/cache.js');

const bignum = require('bignum');

const JobHelperService = require('src/services/job.helper.service.js');
const BlockTemplateService = require('src/services/block.template.service.js');

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const MoneroApi = require('src/api/monero.api.js');

const SapphireApi = require('src/api/monero.api.js');


class MinerModel {

  /**
   * Serialize from JSON or JWT token into a Miner instance
   * @param {object} data
   */
  constructor(data) {
    this.address = data.address;
    this.id = data.id;
  }

    /**
     *
     * @param {JSON} data The JSON data of a miner that needs to be serialized
     */
  static fromToken(tok) {
    try {
     return new MinerModel(tok.account);
    } catch (e) {
      logger.core.error(e);
      return null;
    }
  }

  /**
     *
     * @return {BlockTemplate} jobTemplate
     */
  async getJob() {
    const blockTemplate = await BlockTemplateService.getBlockTemplate();
    return new Promise((resolve,reject) => {
      JobHelperService.create(blockTemplate, this.id)
        .then((job) => {
          resolve(job);
        }).catch((err)=>{
          logger.core.error("Could not fetch job! : "+err);
          reject(err);
        });


    });
  }
  
  /**
     *
     * @Example Request
     * "id": 2,
     * "jsonrpc": "2.0",
     * "method": "submit",
     * "params": {
     * "id": "1be0b7b6-b15a-47be-a17d-46b2911cf7d0",
     * "job_id": "4BiGm3/RgGQzgkTI/xV0smdA+EGZ",
     * "nonce": "d0030040",
     * "result": "e1364b8782719d7683e2ccd3d8f724bc59dfa780a9e960e7c0e0046acdb40100"
     * }
     * @param {request} req
     */
  async submit(params) {
    const minerData = {
      id: params.id,
      job_id: params.job_id,
      nonce: params.nonce,
      results: params.result,
    };
    const job = await JobHelperService.getFromId(minerData.job_id);
    const block = BlockReferenceService.buildBlock(minerData, job);
    
    return new Promise((resolve,reject)=>{

      resolve({status: "ok"});

    })
    
    const timestamp = new Date();
    if (!BlockReferenceService.checkBlock(block, minerData.result)) {
      // sapphireApi.sendShareInfo(job.minerId, job.difficulty, Date.now());
      return {error: "Invalid block! "};
    }
    if (BlockReferenceService.checkDifficulty(job.difficulty, block)) {
      await moneroApi.submit(block).then((result)=>{console.dir(result)});
      
      const payload = {
        "minerId": minerData.id,
        "timestamp": timestamp,
        "blockheight": job.height,
        "difficulty": job.difficulty,
        "jackpot": false
      };
      if(result.status === "ok"){
          payload.jackpot = true;
      }
      sapphireApi.sendShareInfo(payload);
      return {"status": "share granted"};
    } else {
      sapphireApi.sendShareInfo();
      return {error: 'Does not meet difficulty'};
    }
  }
}

module.exports = MinerModel;
