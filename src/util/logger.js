'use strict';
const bunyan = require('bunyan')
, bformat = require('bunyan-formatter')  
, formatOut = bformat({ outputMode: 'short', level: 'debug'});

const gelfStream = require('gelf-stream')
const config = require('src/util/config.js');

const gelfHost = config.get('fluentd_host') || 'localhost';
const gelfPort = config.get('fluentd_port') || 9999;

let streams = [];
streams.push({stream: formatOut });


let streams = [];
streams.push({ stream: formatOut });
if(config.get('prod_logging')){
  streams.push({
    stream: gelfStream.forBunyan(gelfHost, gelfPort),
    type: 'raw'
  })
}



const logger = bunyan.createLogger({
  name: 'emerald',
  streams
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
