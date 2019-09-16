'use strict';

const logger = require('src/util/logger.js');

const cache = require('src/util/cache.js');

function calculateShare(difficultyThresh){
    if(blockHash > difficultyThresh){

    }


}


const ShareService = {





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

      return diamondApi.login(params.login, params.pass)
      .then(accessToken => {
          return diamondApi.decodeAndVerifyToken(accessToken);
      })
      .then(tokenJSON => {
          logger.info(`Storing JSONToken for ${params.login} into cache`);
          return cache.put(tokenJSON.sub, tokenJSON);
      })
      .then(() => {
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

module.exports = ShareService;
