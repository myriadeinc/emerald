/* eslint-disable require-jsdoc */
'use strict';
const logger = require('src/util/logger.js').monero;
const BlockTemplate = require('src/models/block.template.model.js');

const axios = require('axios');
const config = require('src/util/config.js');
const reserveSize = config.get('pool:reserveSize') || 8;

/**
 * @todo: Change to RPC client
 *  */ 
function sendRpcBase(method, payload) {
  
  return axios({
    url: `http://${config.get('monero:daemon:host')}:${config.get('monero:daemon:port')}/json_rpc`,
    method: 'POST',
    data: {
      json_rpc: '2.0',
      id: '1',
      method,
      params: payload,
    },
  })
  .then(({data}) =>{
    if (data.error) {
      logger.error(`Error while sending RPC request for method ${method} \n \t payload: ${JSON.stringify(payload)}; \n \t Error: ${data.error.message}`);
      throw data.error
    }
    else {
      return data.result;
    }
  })
  
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
    * @description Gets the header of the last block
    * @return {object} Returns the header of the last block
    */
  getLastBlockHeader: async () => {
    return sendRpcBase('get_last_block_header', {});
  },

  /**
    * @description Submit a block to the daemon
    * @param {String} hexBlock Block represented as hex string
    * @return {object} The status of block submitted, in JSON RPC format
    */
  submit: async (hexBlock) => {
    return await sendRpcBase('submit_block', [hexBlock]);
  },
};

module.exports = MoneroApi;
