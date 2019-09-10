'use strict';
const bunyan = require('bunyan')
, bformat = require('bunyan-formatter')  
, formatOut = bformat({ outputMode: 'short' });

// Later for production we can use LogDNA on the Bunyan stream

const logger = bunyan.createLogger({
  name: 'emerald',
  stream: formatOut
});

module.exports = {
  core: logger.child({component: 'core'}),
  db: logger.child({component: 'db'}),
  cache: logger.child({component: 'cache'}),
  monero: logger.child({component: 'monero'}),
  block: logger.child({component: 'block_service'}),
  miner: logger.child({component: 'miner'}),
};
