/* eslint-disable require-jsdoc */
'use strict';
const MQ = require('src/util/mq.js');

/**
 * @todo: Add proper error logging
 */
const SapphireApi = {
  sendShareInfo: (data) => {
    return MQ.send(data);
  }
}

module.exports = SapphireApi;
