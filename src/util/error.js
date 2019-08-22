'use strict';
const Err = require('egads')
    .extend('Unexpected error occured', 500, 'InternalServerError');

Err.BlockTemplate = Err.extend('Block Template Error', 500, 'BlockTemplateError');

Err.BlockTemplate.instantiation = Err.BlockService.extend('BlockTemplate Instantiation Error', 500, 'BlockTemplateError::Instantiation');

module.exports = Err;
