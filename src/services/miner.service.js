'use strict';

const logger = require('src/util/logger.js').miner;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const cache = require('src/util/cache.js');

const MinerService = {

  rpcInterface: {
    job: (params) => {
      const miner = params.miner;
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

    submit: (params) => {
      const miner = params.miner;
      return miner.submit({})
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
          logger.info(`Storing JSONToken for ${params.login} into cache`);
          tokenJSON.account.id = tokenJSON.sub;
          return cache.put(tokenJSON.account.address, tokenJSON);
      })
      .then((res) => {
          return "success";
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
