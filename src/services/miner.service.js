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
                resolve('login is not implemented');
            });
        },
         
        keepalived: () => {
            return new Promise((resolve, reject) => {
                const res = {
                    status: 'KEEPALIVED'
                };
                resolve(res)
            })
        }
    }
    
}

module.exports = MinerService;