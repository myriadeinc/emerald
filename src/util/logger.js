'use strict';
const bunyan = require('bunyan')
, bformat = require('bunyan-formatter')  
, formatOut = bformat({ outputMode: 'short', level: 'debug'});

const config = require('src/util/config.js');

let LogDNAStream = require('logdna-bunyan').BunyanStream;
let logDNA = new LogDNAStream({
  key: config.get('log:logdna_api_token')
}) || null;

const logger = bunyan.createLogger({
  name: 'emerald',
  streams: [ 
    {
      stream:formatOut 
    }, 
    {
      stream: logDNA || formatOut,
      type: 'raw'
    }
  ]
});


module.exports = {
  core: logger.child({component: 'core'}),
  db: logger.child({component: 'database'}),
  mq: logger.child({component: 'messaging_queue'}),
  cache: logger.child({component: 'cache'}),
  monero: logger.child({component: 'monero'}),
  block: logger.child({component: 'block_service'}),
  miner: logger.child({component: 'miner'}),
};
