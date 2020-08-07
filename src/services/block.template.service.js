const config = require('src/util/config.js');
const axios = require('axios');
const logger = require('src/util/logger.js').block;
const BlockTemplateModel = require('src/models/block.template.model.js');
const moneroApi = require('src/api/monero.api.js');

let currentBlockTemplate = null;
let lastTime = new Date();

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
        const blockTime = (new Date().getTime() - lastTime.getTime()) / 1000;
        logger.info(`New blockheight found at height:${recentTemplate.height} from time: ${blockTime}`);
        lastTime = new Date();
        currentBlockTemplate = recentTemplate;
        const resp = await axios.get('http://shadowstone:9990/refresh')
        if (resp.data == 'OK') {
          logger.info('Shadowstone job refreshed')
        }

      }
    }
    catch (err) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        logger.error("Could not send refresh notification to shadowstone: bad request")
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        logger.error("Could not send refresh notification to shadowstone: no response")
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
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
    lastTime = new Date();
    logger.info('Block Templating queue initialized!');

    // return BlockTemplateService.subscribeToUpdates();
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
