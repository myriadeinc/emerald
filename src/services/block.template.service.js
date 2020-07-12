const config = require('src/util/config.js');
const axios = require('axios');
const logger = require('src/util/logger.js').block;
const BlockTemplateModel = require('src/models/block.template.model.js');
const moneroApi = require('src/api/monero.api.js');

let currentBlockTemplate = null;

const BlockTemplateService = {

  // Currently removing pickaxe as we refactor some service roles
  // subscribeToUpdates: () => {
  //   // Fire and forget the poller
  //   return axios({
  //     url: `http://${config.get('pickaxe:host')}:${config.get('pickaxe:port')}/api/v1/subscribe/`,
  //     method: 'post',
  //     data: {
  //       // Add proper route to config file
  //       hostname: `http://${config.get('service:host')}:${config.get('service:port')}/v1/block`,
  //     },
  //     headers: {
  //       Authorization: `shared_secret ${config.get('service:shared_secret')}`,
  //     },
  //   });
  // },
  poller: async () => {

    try {
      const recentTemplate = await moneroApi.getBlockTemplate();


      // Works up until ~15 digits, then we have to switch to BigInt
      if (Number(recentTemplate.height) > Number(currentBlockTemplate.height)) {
        logger.info(`New blockheight found at height:${recentTemplate.height}`);
        currentBlockTemplate = recentTemplate;

        try {
          const resp = await axios.get('http://shadowstone:9990/refresh')
          console.dir(resp.data)
        } catch (err) {
          logger.error("I couldnt do it!")
          // logger.core.error(err)
        }


      }
    }
    catch (err) {
      logger.error(err)
    }

  },

  getBlockTemplate: async () => {
    const template = currentBlockTemplate || await moneroApi.getBlockTemplate();
    return template;
  },

  init: async () => {
    const blockTemplate = await moneroApi.getBlockTemplate();
    currentBlockTemplate = blockTemplate;

    // return BlockTemplateService.subscribeToUpdates();
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
