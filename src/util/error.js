'use strict';
const Err = require('egads')
    .extend('Unexpected error occured', 500, 'InternalServerError');

Err.BlockTemplate = Err.extend('Block Template Error', 500, 'BlockTemplateError');

Err.BlockTemplate.instantiation = Err.BlockService.extend('BlockTemplate Instantiation Error', 500, 'BlockTemplateError::Instantiation');

Err.Miner = Err.extend('Miner Error', 500, 'MinerError');

Err.Miner.instantiation = Err.Miner.extend('Miner Instantiation Error', 500, 'MinerInstantiationError');


module.exports = Err;
