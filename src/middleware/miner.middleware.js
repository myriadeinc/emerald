'use strict';

const config = require('src/util/config.js');
const Err = require('src/util/error.js').Miner;
const logger = require('src/util/logger.js').miner;
const _ = require('lodash');
const cache = require('src/util/cache.js');

const DiamondApi = require('src/api/diamond.api.js');
const MinerModel = require('src/models/miner.model.js');

const diamondApi = new DiamondApi();


const validateToken = (tok) => {
    
}

const loadMiner = (decodedToken, request) => {
    const miner =  MinerModel.serializeJWT(decodedToken);
    if (miner) {
        if (request.params.miner){
            delete request.params.miner;
        }
        request.params.miner = miner;
    }
}

const validateMiner = (request) => {
    return new Promise((resolve, reject) => {
        let token =null;
        let decodedToken;
        const minerAddress = request.body.params.address;
        if (request.header.authorization && 
            'Bearer' === request.header.authorization.split()[0]){
                token = request.header.authorization.split()[1]
        }
        if (token){
            return diamondApi.decodeAndVerifyToken(token)
            .then((tok) => {
                decodedToken = tok;
            })
            .catch(err => {
                reject(e);
            })
        }
        else {
            try {
                decodedToken = cache.get(minerAddress);
            }
            catch(e) {
                reject(e);
            }
        }
        resolve(decodedToken);

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
            .then((decodedToken) => {
                loadMiner(decodedToken, request);
                next();
            })
            .catch(err => {
                logger.error(`While authenticating this occured, ${err} for miner ${req.body.params.minerId}`);
                res.status(403).send('Authentication Failure');
            })
        }
        else {
            next();
        }
    }
}

module.exports = MinerMiddleware;