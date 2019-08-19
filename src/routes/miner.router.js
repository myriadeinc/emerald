const router = require('express').Router();

const MinerService = require('src/services/miner.service.js');
const jayson = require('jayson/promise');


router.post('/', jayson.server(MinerService.rpcInterface).middleware());

module.exports = router;