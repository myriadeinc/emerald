const config = require('src/util/config.js');
const axios = require('axios');
const BlockTemplateModel = require('src/models/block.template.model.js');
const moneroApi = require('src/api/monero.api.js');

let currentBlockTemplate;

const BlockTemplateService = {

  subscribeToUpdates: () => {
    return axios({
      url: `http://${config.get('pickaxe:host')}:${config.get('pickaxe:port')}/api/v1/subscribe/`,
      method: 'post',
      data: {
        // Add proper route to config file
        hostname: `http://${config.get('service:host')}:${config.get('service:port')}/v1/block`,
      },
      headers: {
        Authorization: `shared_secret ${config.get('service:shared_secret')}`,
      },
    });
  },

  getBlockTemplate: async () => {
    const template = currentBlockTemplate || await moneroApi.getBlockTemplate;
    return template;
  },

  init: async () => {
    const blockTemplate = await moneroApi.getBlockTemplate();
    currentBlockTemplate = blockTemplate;
    return BlockTemplateService.subscribeToUpdates();
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
