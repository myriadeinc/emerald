'use strict';

const MQ = require('src/util/mq.js');

// API interface to interact with Sapphire
/**
 * data:{
 * minerId: _,
 * shareType: _, ENUM
 * timestamp: _,
 * }
 * 
 * 
 * 
 */

class SapphireApi {
  constructor() {
  }

  sendShareInfo(data) {
    return MQ.send(data);
  }

}

export default SapphireApi;
