'use strict';

const logger = require('src/util/logger.js').miner;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const cache = require('src/util/cache.js');

const MinerService = {

  rpcInterface: {
    job: (params) => {
      return new Promise((resolve, reject) => {
        reject('getJob is not implemented');
      });
    },

    submit: (params) => {
      return new Promise((resolve, reject) => {
        reject('submit is not implemented');
      });
    },

    login: (params) => {

      return diamondApi.login(params.pass, params.login)
      .then(accessToken => {
          return diamondApi.decodeAndVerifyToken(accessToken);
      })
      .then(tokenJSON => {
          return cache.put(tokenJSON.sub, tokenJSON);
      })
      .then(() => {
          return "success";
      })
      .catch(err => {
          logger.core.error(err);
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
