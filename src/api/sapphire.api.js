'use strict';

const MQ = require('src/util/mq.js');

// API interface to interact with Sapphire
class SapphireApi {
  constructor() {
  }

  sendShareInfo(data) {
      return MQ.send(data)
  }
}

export default SapphireApi;
