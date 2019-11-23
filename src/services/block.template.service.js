const config = require('src/util/config.js');
const axios = require('axios');
const logger = require('src/util/logger.js');
const BlockTemplateModel = require('src/models/block.template.model.js');
const MoneroApi = require('src/api/monero.api.js');
let currentBlockTemplate;

const BlockTemplateService = {

  subscribeToUpdates: () => {
    return axios({
      url: `http://${config.get('pickaxe:host')}:${config.get('pickaxe:port')}/api/v1/subscribe/`,
      method: 'post',
      data: {
        hostname: `http://${config.get('service:host')}:${config.get('service:port')}`,
      },
      headers: {
        Authorization: `shared_secret ${config.get('service:shared_secret')}`,
      },
    });
  },

  getBlockTemplate: () => {
    return currentBlockTemplate;
  },

  init: () => {
    const moneroApi = new MoneroApi();
    return moneroApi.getBlockTemplate()
        .then((block) => {
          currentBlockTemplate = block;
          return BlockTemplateService.subscribeToUpdates();
        });
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
