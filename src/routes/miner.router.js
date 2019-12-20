const router = require('express').Router();

const MinerMiddleware = require('src/middleware/miner.middleware.js');
const MinerService = require('src/services/miner.service.js');

router.post('/',
    MinerMiddleware.rpcAuthenticateMiner,
);

module.exports = router;
