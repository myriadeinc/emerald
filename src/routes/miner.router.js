const router = require('express').Router();

const MinerService = require('src/services/miner.service.js');
const jayson = require('jayson/promise');

const MinerMiddleware = require('src/middleware/miner.middleware.js');

router.post('/',
    MinerMiddleware.rpcAuthenticateMiner,
    jayson.server(MinerService.rpcInterface).middleware());

module.exports = router;
