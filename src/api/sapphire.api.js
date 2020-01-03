/* eslint-disable require-jsdoc */
'use strict';

const MQ = require('src/util/mq.js');

/**
 * TODO: Add proper error logging
 */
class SapphireApi {
  sendShareInfo(data) {
    return MQ.send(data);
  }
}

export default SapphireApi;
