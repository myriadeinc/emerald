const router = require('express').Router();

const MinerMiddleware = require('src/middleware/miner.middleware.js');
const MinerService = require('src/services/miner.service.js');
const jsonRPC = require('express-json-rpc-router');


router.post('/',
    MinerMiddleware.rpcAuthenticateMiner,
    jsonRPC({methods: MinerService}),
);

module.exports = router;
