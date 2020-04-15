const config = require('src/util/config.js');
const axios = require('axios');
const BlockTemplateModel = require('src/models/block.template.model.js');
const moneroApi = require('src/api/monero.api.js');

let currentBlockTemplate;

// let baseBlockTemplate = {
  


// };


// const debugUrl = "http://staging.myriade.io/pickaxe/api/v1/subscribe";
// const debugRec = "http://ef8555d7.ngrok.io";
// const debugSecret = "";
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
        Authorization: debugSecret ||`shared_secret ${config.get('service:shared_secret')}`,
      },
    });
  },

  getBlockTemplate: async () => {
    return await moneroApi.getBlockTemplate();
  },



  init: async () => {
    // console.log("debug mode "+config.get('test:debug'));
    // console.log("optins "+config.get('test:foobar'));
    const blockTemplate = await moneroApi.getBlockTemplate();
    currentBlockTemplate = blockTemplate;
    return BlockTemplateService.subscribeToUpdates();
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
