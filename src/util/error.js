'use strict';
const Err = require('egads')
    .extend('Unexpected error occured', 500, 'InternalServerError');

Err.BlockTemplate = Err.extend('Block Template Error', 500, 'BlockTemplateError');

Err.BlockTemplate.instantiation = Err.BlockTemplate.extend('BlockTemplate Instantiation Error', 500, 'BlockTemplateError::Instantiation');

Err.Miner = Err.extend('Miner Error', 500, 'MinerError');

Err.Miner.instantiation = Err.Miner.extend('Miner Instantiation Error', 500, 'MinerInstantiationError');

Err.Miner.login = Err.Miner.extend('Miner Login Error', 500, 'MinerLoginError');

Err.Miner.authentication = Err.Miner.extend('Unable to authenticate Miner, please try to login again', 403, 'MinerAuthenticationError');

module.exports = Err;
