const config = require('src/util/config.js');
const axios = require('axios')
const logger = require('src/util/logger.js')
const BlockTemplateModel = require('src/models/block.template.model.js');

let currentBlockTemplate;

const BlockTemplateService = {

  subscribeToUpdates: () => {
    return axios({
      url: `http://${config.get('pickaxe:host')}:${config.get('pickaxe:port')}/v1/api/subscribe`,
      method: 'post',
      data: {
          hostname: `http://${config.get('service:host')}:${config.get('service:port')}`
      },
      headers: {
          Authorization: `shared_secret ${config.get('service:shared_secret')}`
      }
    })
  },

  getBlock: () => {
    return currentBlockTemplate;
  },

  init: () => {
    // make an RPC request to Daemon to get block and initiate it with this
    return axios({
      url: `http://${config.get('monero:daemon:host')}:${config.get('monero:daemon:port')}/json_rpc`,
      method: 'post',
      data: {
        json_rpc:"2.0",
        id:"0",
        method:"get_block_template",
        params:{
          wallet_address: config.get('pool:poolAddress')
        }
      }
    })
    .then(({data}) => {
      if (data.error){
        throw 0;
      }
      return BlockTemplateService.updateBlock(data.result);
    })
    .then(() => {
      return BlockTemplateService.subscribeToUpdates()
    })
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  }
};

module.exports = BlockTemplateService;