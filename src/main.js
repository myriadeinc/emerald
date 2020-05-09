const path = require('path');
const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const BlockTemplateService = require('src/services/block.template.service.js');

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');
const StratumService = require('src/services/stratum.service.js');
const jayson = require('jayson/promise');
const cache = require('src/util/cache.js');
const mq = require('src/util/mq.js');
const axios = require('axios');
// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript
let server;

const main = async () => {
  logger.core.info(`Starting Emerald for ${config.get('pool:desc')}`);

  logger.core.info('Initializing cache DB');
  await cache.init(config.get('cache'));
  logger.core.info('Cache initialized');

  logger.core.info(`Initializing messaging queue RabbitMQ: ${config.get('rabbitmq:url')}`);
  await mq.init(config.get('rabbitmq:url'));

  logger.core.info('Initializing Block Templating service');
  await BlockTemplateService.init();

  // Ideally we should use something like pickaxe for polling, however at this point emerald/shadowstone/pickaxe should be refactored with stronger typing such as golang
  setInterval(BlockTemplateService.poller, 2000);

  const http_port = config.get('http:port') || 22345;
  const tcp_port = config.get('tcp:port') || 32345;
  const stratum = jayson.server(StratumService);
  
    stratum.http().listen(http_port, () => {
      logger.core.info(`Stratum HTTP JSON-RPC Listening on port ${http_port}`);
    });
 
    stratum.tcp().listen(tcp_port, () => {
      logger.core.info(`Stratum TCP JSON-RPC Listening on port ${tcp_port}`);
    });
  
  

  const internalPort = config.get('service:port');
  const internalServer = require('src/server.internal.js');

  server = internalServer.listen(internalPort, () => {
    logger.core.info(`Internal server listening on port ${internalPort}`);
  });

};

const gracefulShutdown = () => {
  server.close(async () => {
    console.log(`${config.get('service')} is gracefully shutting down on port ${port}`);
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
  console.log('Unhandled promise rejection!', err);
  process.exit(1);
});


main().catch((err) => {
  logger.core.error(err);
  process.exit(1);
});


