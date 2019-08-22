'use strict';

const logger = require('src/util/logger.js').miner;
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
            return new Promise((resolve, reject) => {
                logger.info(`${params.login} trying to login with ${params.agent}`);
                resolve('login is not implemented');
            });
        },
         
        keepalived: (params) => {
            return new Promise((resolve, reject) => {
                resolve({
                    status: 'KEEPALIVED'
                });
            })
        }
    }
    
}

module.exports = MinerService;