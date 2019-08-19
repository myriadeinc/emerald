'use strict';

const MinerService = {

    rpcInterface: {
        job: () => {
            return new Promise((resolve, reject) => {
                reject('getJob is not implemented');
            });
        },
    
        submit: () => {
            return new Promise((resolve, reject) => {
                reject('submit is not implemented');
            });
        },
    
        login: () => {
            return new Promise((resolve, reject) => {
                //console.log('here');
                resolve('login is not implemented');
            });
        }
    }
    
}

module.exports = MinerService;