/* eslint-disable require-jsdoc */
'use strict';

const MQ = require('src/util/mq.js');

/**
 * TODO: Add proper error logging
 */
const SapphireApi = {
  sendShareInfo: (data) => {
    return MQ.send(data);
  }
}

module.exports = SapphireApi;
