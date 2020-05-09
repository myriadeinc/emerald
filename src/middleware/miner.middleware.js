'use strict';
/**
 * Dead code.
 * The original purpose of this code was to properly authenticate miners as they were logging in. 
 * However, the current reference client (xmrig) sends data, including auth, as plaintext packets over TCP.
 * If there were a modified client, we can keep this code. But even at this current stage, we cannot fully support the client as is (job pushing is not operational).
 * AS discussed in the Diamond API file, we won't be using this library until there is a custom client or a refactor/rewrite of emerald itself
 */
// const config = require('src/util/config.js');
// const Err = require('src/util/error.js').Miner;
// const logger = require('src/util/logger.js').miner;
// const _ = require('lodash');
// const cache = require('src/util/cache.js');
// const BanService = require('src/services/ban.service.js');
// const DiamondApi = require('src/api/diamond.api.js');
// const MinerModel = require('src/models/miner.model.js');

// const diamondApi = new DiamondApi();

// const loadMiner = (decodedToken, request) => {
//   const miner = MinerModel.fromToken(decodedToken);
//   if (miner) {
//     const data = request.body.params;
//     delete request.body.params;
//     request.body.params = {
//       data,
//       miner,
//     };
//   }
// };


// const filterMethods = (securedMethods, method) => {
//   return _.includes(securedMethods, method);
// };

// const MinerMiddleware = {};

// module.exports = MinerMiddleware;
