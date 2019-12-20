/* eslint-disable require-jsdoc */
'use strict';
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').monero;
const BlockTemplate = require('src/models/block.template.model.js');

const axios = require('axios');
const reserveSize = config.get('pool:reserveSize') || 8;

// @TODO: Change to RPC client
function sendRpcBase(method, data) {
  return new Promise(function(resolve, reject) {
    axios({
      url: `http://${config.get('monero:daemon:host')}:${config.get('monero:daemon:port')}/json_rpc`,
      method: 'post',
      data: {
        json_rpc: '2.0',
        id: '1',
        method,
        params: data,
      },
    })
        .then(({data}) =>{
          resolve(data.result);
        })
        .catch((err)=>{
          logger.error(err);
          reject(err);
        });
  });
}

const MoneroApi = {
  /**
    * @description Gets the next block template from the Daemon : promisified
    * @return {Blocktemplate} Returns an object for the block template
    */
  getBlockTemplate: async () => {
    const response = await sendRpcBase('get_block_template', {
      reserve_size: reserveSize,
      wallet_address: config.get('pool:poolAddress'),
    });
    return new BlockTemplate(response);
  },

  /**
    * @description gets the header of the last block : promisified
    * @return {object} Returns the header of the last block promisified
    */
  getLastBlockHeader: async () => {
    return await sendRpcBase('get_last_block_header', {});
  },

  /**
    * @description Submit a block to the daemon
    * @param {Buffer} buffer Shared buffer constructed with xmr utilities
    * @return {object} The status of block submitted, in JSON RPC format
    */
  submit: async (buffer) => {
    return await sendRpcBase('submit_block', [buffer.toString('hex')]);
  },
};

module.exports = MoneroApi;
