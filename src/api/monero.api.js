'use strict';
const config = require('src/util/config.js');
const logger = require('src/util/logger.js').monero;
const BlockTemplate = require('src/models/block.template.model.js');

const axios = require('axios');

const send_rpc = (method, data) => {
  return axios({
    url: `http://${config.get('monero:daemon:host')}:${config.get('monero:daemon:port')}/json_rpc`,
    method: 'post',
    data: {
      json_rpc: '2.0',
      id: '0',
      method,
      params: data,
    },
  })
      .then(({data}) =>{
        return data.result;
      });
};

class MoneroApi {
  constructor(host=null, port=null, wallet_host=null) {
    this.__daemon_host = host ? host: config.get('monero:daemon:host');
    this.__daemon_port = port ? port: config.get('monero:daemon:port');
    this.__wallet_host = wallet_host ? wallet_host: config.get('monero:wallet:host');
  }

  /**
    * @description gets the next block template from the Daemon : promisified
    * @param {object} params object for configuring the next template
    * @return {object}  Returns an object for the block template
    */

  async getBlockTemplate() {
    try {
      const res = await send_rpc('getblocktemplate', {
        reserve_size: 8,
        wallet_address: config.get('pool:poolAddress'),
      });
      const blockTemplate = new BlockTemplate(res);
      return blockTemplate;
    } catch (e) {
      logger.error(e);
    }
  }

  /**
    * @description gets the header of the last block : promisified
    * @return {object} Returns the header of the last block promisified
    */
  getLastBlockHeader() {
    return send_rpc('getlastblockheader', {});
  }

  /**
    * @description Submit a block to the daemon
    * @param {object} buffer Shared buffer constructed with xmr utilities
    */
  submit(buffer) {
    return send_rpc('submitblock', [buffer.toString('hex')]);
  }
}

module.exports = MoneroApi;
