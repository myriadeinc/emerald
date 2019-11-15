'use strict';

const testing = require('../test.init.js');

const BlockReferenceService = require('src/services/block.reference.service.js');

const MinerModel = require('src/models/miner.model.js');

const config = require('src/util/config.js');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-string'))
  .should();

describe('Unit test for Block Reference Service', ()=> {
  let miner;
  let job;
  let blockTemplate;

  before('setup', () => {
    miner = MinerModel({
      address = '0x1',
      name = 'john',
      id = '1'
    })
    job = miner.getJob();
  });

  it('should #buildBlock and return a blockTemplate blob', () => {

  });
})