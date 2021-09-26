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
  handleReqErr: (err) => {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      logger.error("Could not send refresh notification to worker: bad request")
    } else if (err.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(err.request);
      logger.error("Could not send refresh notification to worker: no response")
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error(err.message)
    }
    logger.error(err)
  },


  poller: async () => {

    try {
      
      const recentTemplate = await moneroApi.getBlockTemplate();
      // Works up until ~15 digits, then we have to switch to BigInt
      if (Number(recentTemplate.height) > Number(currentBlockTemplate.height)) {
        const blockTime = (new Date().getTime() - lastTime.getTime()) / 1000;
        logger.info(`New blockheight found at height:${recentTemplate.height} duration: ${Math.ceil(blockTime)}`);
        lastTime = new Date();
        currentBlockTemplate = recentTemplate;
        axios.get(`http://sapphire:8081/v1/god/refresh?block=${recentTemplate.height}`)
        .then(res => logger.debug(`Sapphire Update ${res.data}` ))
        .catch(e => BlockTemplateService.handleReqErr(e))
        

        // Goodbye shadowstone
        // axios.get(config.get('shadowstone:host'))
        // .then(res => logger.info(`Shadowstone job ${res.data}` ))
        // .catch(e => BlockTemplateService.handleReqErr(e))
        
        axios.get(config.get('whetstone:host'))
        .then(res => logger.debug(`Whetstone job ${res.data}` ))
        .catch(e => BlockTemplateService.handleReqErr(e))
        

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
    lastTime = new Date();
    logger.info('Block Templating queue initialized!');

    // return BlockTemplateService.subscribeToUpdates();
  },

  updateBlock: (data) => {
    currentBlockTemplate = new BlockTemplateModel(data);
  },
};

module.exports = BlockTemplateService;
