const config = require('src/util/config.js');
const axios = require('axios')

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

  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  }
};

module.exports = BlockTemplateService;