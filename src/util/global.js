'use strict';
const config = require('src/util/config.js');

const variance = config.get('pool:varDiff:variancePercent') / 100 * config.get('pool:varDiff:targetTime');

const VARDIFF ={
  variance,
  bufferSize: config.get('pool:varDiff:retargetTime') / config.get('pool:varDiff:targetTime') * 4,
  tMin: config.get('pool:varDiff:targetTime') - variance,
  tMax: config.get('pool:varDiff:targetTime') + variance,
  maxJump: config.get('pool:varDiff:maxJump'),
};

module.exports = {
  VARDIFF,
};
