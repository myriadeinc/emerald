'use strict';

const logger = require('src/util/logger.js').miner;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const BlockTemplateService = require('src/services/block.template.service.js');
const MinerModel = require('src/models/miner.model.js');

const cache = require('src/util/cache.js');
const config = require('src/util/config.js');
const MinerService = {
  // Test function
  paramDump: (params) => {
    return params;
  },
  job: ({miner, data}) => {
    return miner.getJob()
        .then((job) => {
          return {
            job,
            success: true,
          };
        })
        .catch((err) => {
          logger.error(err);
          return err;
        });
  },

  submit: ({miner, data}) => {
    return miner.submit(data)
        .then((result) => {
          return result;
        })
        .catch((err) => {
          logger.error(err);
          return err;
        });
  },

  login: (params) => {
    const login = params.login;
    const pass = params.pass;

    return diamondApi.login(login, pass)
        .then((accessToken) => {
          return diamondApi.decodeAndVerifyToken(accessToken);
        })
        .then((tokenJSON) => {
          tokenJSON.account.id = tokenJSON.sub;
          logger.info(`Storing JSONToken for miner: ${tokenJSON.account.id} into cache`);
          cache.put(tokenJSON.account.id, tokenJSON, 'MINER_ID');
          return MinerModel.fromToken(tokenJSON);
        })
        .then((miner) => {
          if (!miner) {
            throw Error('Miner not found!');
          }
          return miner.getJob();
        })
        .catch((err) => {
          logger.error(err);
          return Error('Login failed');
        });
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
