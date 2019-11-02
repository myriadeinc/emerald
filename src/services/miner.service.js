'use strict';

const logger = require('src/util/logger.js').miner;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const BlockTemplateService = require('src/services/block.template.service.js');
const MinerModel = require('src/models/miner.model.js');

const cache = require('src/util/cache.js');

const MinerService = {

  rpcInterface: {
    job: ({miner, data}) => {
      return miner.getJob()
      .then((job) => {
        return {
          job,
          success: true
        }
      })
      .catch((err) => {
        logger.error(err);
        return "Failed";
      })
    },

    submit: ({miner, data}) => {
      return miner.submit(data)
      .then(() => {
        return "Done";
      })
      .catch(err => {
        logger.error(err);
        return "Failed";
      })
    },

    login: (params) => {
      return diamondApi.login(params.login, params.pass)
      .then(accessToken => {
          return diamondApi.decodeAndVerifyToken(accessToken);
      })
      .then(tokenJSON => {
          tokenJSON.account.id = tokenJSON.sub;
          logger.info(`Storing JSONToken for miner: ${tokenJSON.account.id} into cache`);
          cache.put(tokenJSON.account.id, tokenJSON, "MINER_ID");
          return MinerModel.fromToken(tokenJSON);
      })
      .then((miner) => {
          if (!miner){
            throw 0;
          }
          return miner.getJob();
      })
      .catch(err => {
          logger.error(err);
          return "Login Failed";
      })
      
    },

    keepalived: (params) => {
      return new Promise((resolve, reject) => {
        resolve({
          status: 'KEEPALIVED',
        });
      });
    },
  },

};

module.exports = MinerService;
