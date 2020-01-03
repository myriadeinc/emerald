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
    // To be modified since this is suppose to be a push notification according tto
    //  strantum
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

  submit: (params) => {
    return new Promise((resolve, reject) => {
      miner.submit(data)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error(err);
        reject(err);
      });
    });
   
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

        resolve(responseBody);
        
      }).catch((err) => {
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
