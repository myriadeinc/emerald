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
  // {miner,data}
  job: (params) => {
    console.log("job method called!");
    return miner.getJob()
        .then((job) => {
          return {
            job,
            success: true,
          }
        })
        .catch((err) => {
          logger.error(err);
          return err;
        });
  },

  // TODO: promisify
  submit: (params) => {
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
    return new Promise((resolve,reject) => {
      diamondApi.login(login, pass)
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
          return miner.getJob().then((result)=>{
            
            resolve({
              id: miner.id,
              job: result,
              status: "OK"
            });
            
          });
          
        })
        .catch((err) => {
          logger.error(err);
          reject(Error('Login failed'));
        });
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
