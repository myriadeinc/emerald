'use strict';

const config = require('src/util/config.js');
const Err = require('src/util/error.js').Miner;
const logger = require('src/util/logger.js').miner;
const _ = require('lodash');
const cache = require('src/util/cache.js');
const BanService = require('src/services/ban.service.js');
const DiamondApi = require('src/api/diamond.api.js');
const MinerModel = require('src/models/miner.model.js');

const diamondApi = new DiamondApi();

const loadMiner = (decodedToken, request) => {
  const miner = MinerModel.fromToken(decodedToken);
  if (miner) {
    const data = request.body.params;
    delete request.body.params;
    request.body.params = {
      data,
      miner,
    };
  }
};

const validateMiner = (request) => {
  return new Promise((resolve, reject) => {
    let token = null;
    const minerId = request.body.params.id;
    if (BanService.checkBan(minerId)) {
      reject(Error('You have been banned!'));
    }
    // We can't do this since Stratum uses JSON-RPC over TCP
    if (request.body.authorization &&
        'Bearer' === request.body.authorization.split()[0]) {
      token = request.headers.authorization.split()[1];
    }
    if (token) {
      return diamondApi.decodeAndVerifyToken(token)
          .then((tok) => {
            decodedToken = tok;
          })
          .catch((err) => {
            reject(e);
          });
    } else {
      return cache.get(minerId)
          .then((tok) => {
            if (!tok) {
              reject(Error('User not logged in!'));
            }
            resolve(tok);
          })
          .catch((err) => {
            reject(err);
          });
    }
  });
};

const filterMethods = (securedMethods, method) => {
  return _.includes(securedMethods, method);
};
const MinerMiddleware = {
  // rpcAuthenticateMiner: (req, res, next) => {
  //   const currMethod = req.body.method;
  //   const needAuth = filterMethods([
  //     'submit',
  //     'job',
  //   ], currMethod);
  //   if (needAuth) {
  //     return validateMiner(req)
  //         .then((decodedToken) => {
  //           loadMiner(decodedToken, req);
  //           next();
  //         })
  //         .catch((err) => {
  //           logger.error(`While authenticating this occured, ${err} for miner ${req.body.params.address}`);
  //           res.status(403).send('Authentication Failure');
  //         });
  //   } else {
  //     next();
  //   }
  // },

  rpcAuthenticateMiner: (method, )

};

module.exports = MinerMiddleware;
