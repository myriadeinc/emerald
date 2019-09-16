'use strict';

const config = require('src/util/config.js');
const logger = require('src/util/logger.js').miner;
const _ = require('lodash');
const cache = require('src/util/cache.js');

const DiamondApi = require('src/api/diamond.api.js');
const MinerModel = require('src/models/miner.model.js');

const diamondApi = new DiamondApi();


const validateToken = (tok) => {
    
}

const validateMiner = (request) => {
    return new Promise((resolve, reject) => {
        let token;
        const minerAddress = request.body.params.address;
        
    })
}

const filterMethods = (securedMethods, method) => {
    return _.includes(securedMethods, method);
}; 
const MinerMiddleware = {

    
    rpcAuthenticateMiner : (req, res, next) => {
        // Check if current method needs auth
        const currMethod = req.body.method;
        const needAuth = filterMethods([
            "submit",
            "job"
        ], currMethod);
        if (needAuth) {
            return validateMiner(req)
            .then(() => {

            })
            .catch(err => {

            })
        }
        else {
            next();
        }
    }
}

module.exports = MinerMiddleware;