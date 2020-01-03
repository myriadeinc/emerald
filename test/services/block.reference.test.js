'use strict';

const testing = require('../test.init.js');

const BlockReferenceService = require('src/services/block.reference.service.js');

const xmrUtil = require('cryptoforknote-util');
const multiHashing = require('cryptonight-hashing');

const MinerModel = require('src/models/miner.model.js');

// const config = require('src/util/config.js');
// require('chai')
//   .use(require('chai-as-promised'))
//   .use(require('chai-string'))
//   .should();

describe('Unit test for Block Reference Service', ()=> {
  let miner;
  let job;
  let blockTemplate;

  let powResult = "HEXSTRINGHERE";
  // before('setup', () => {
  //   miner = new MinerModel({
  //     address : "0x1",
  //     name : 'john',
  //     id : '1'
  //   })
  //   job = miner.getJob();
  // });

  it('should #buildBlock and return a blockTemplate blob', () => {
    let block = Buffer.from(blockTemplateBlob, "hex");
    const NonceBuffer = Buffer.from("7a810000", 'hex');
    let result = xmrUtil.construct_block_blob(block, NonceBuffer, 0);

    "HEXSTRINGHERE".toString('hex').should.be.eql("HEXSTRINGHERE");

  });

  it('should compare a block and return true', () => {

    // BlockReferenceService.checkBlock(block, seed_hash, result);
 
    //let blockTemplateBlob ="0c0cbf88baf005e790a70e827cc6c0ef7f6a65587b5d2096454ebbb1b5641d003917f69639d947000000006bca7454ec7321f4012214e481539dd6c54379c5e7dd0788b9201a17d60aa5970b";
    let block = Buffer.from(blockTemplateBlob, "hex");
    const NonceBuffer = Buffer.from("7a810000", 'hex');
    let result = xmrUtil.construct_block_blob(block, NonceBuffer, 0);
    let r = Buffer.from(result, 'hex');
    let t = BlockReferenceService.convertBlock(r);
    t = BlockReferenceService.hashBlock(result);
    "HEXSTRINGHERE".should.be.eql(powResult);

  });
})