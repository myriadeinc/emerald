/* eslint-disable require-jsdoc */
'use strict';
const logger = require('src/util/logger.js').monero;
const BlockTemplate = require('src/models/block.template.model.js');

const axios = require('axios');
const config = require('src/util/config.js');
const reserve_size = config.get('pool:reserveSize') || 8;
const wallet_address = config.get('pool:poolAddress')

const BACKUP_NODE = 'http://node.melo.tools:18081/json_rpc';
/**
 * @todo: Change to RPC client
 *  */
async function sendRpcBase(method, payload) {
  try {
    const response = await axios({
      url: `http://${config.get('monero:daemon:host')}:${config.get('monero:daemon:port')}/json_rpc`,
      method: 'POST',
      data: {
        json_rpc: '2.0',
        id: '1',
        method: method,
        params: payload,
      },
    });
    return response.data.result;
  }
  catch (err) {
    logger.error(`XMR Daemon Error ${JSON.stringify(err)}`)
    
    return sendRpcBaseRetry(method, payload)
  }
}

async function sendRpcBaseRetry(method, payload){
  try {
    const response = await axios({
      url: BACKUP_NODE,
      method: 'POST',
      data: {
        json_rpc: '2.0',
        id: '1',
        method: method,
        params: payload,
      },
    });
    return response.data.result;
  }
  catch (err) {
    logger.error(`Backup Daemon Error ${JSON.stringify(err)}`)
    logger.error(err);
    return { error: true }
  }

}

const MoneroApi = {
  /**
    * @description Gets the next block template from the Daemon : promisified
    * @return {Blocktemplate} Returns an object for the block template
    */
  getBlockTemplate: async () => {
    const response = await sendRpcBase('get_block_template', {
      reserve_size,
      wallet_address,
    });
    return new BlockTemplate(response);
  },
  getInfo: async () => {
    const info = await sendRpcBase('get_info', {});
    return info
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
  submit: (hexBlock) => {
    return sendRpcBase('submit_block', [hexBlock]);
  },
};

module.exports = MoneroApi;
