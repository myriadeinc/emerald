const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const BlockTemplateService = require('src/services/block.template.service.js');

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');
const MinerService = require('src/services/miner.service.js');
const jayson = require('jayson/promise');
const cache = require('src/util/cache.js');
const mq = require('src/util/mq.js');

// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript
let server;


const main = async () => {
  logger.core.info(`Starting Emerald for ${config.get('pool:desc')}`);

  logger.core.info('Initializing cache DB');
  await cache.init(config.get('cache'));
  logger.core.info('Cache initialized');

  logger.core.info('Initializing messaging queue RabbitMQ');
  await mq.init(config.get('rabbitmq:url'));
  logger.core.info('Messaging queue initialized');

  logger.core.info('Initializing Block Templating service');
  await BlockTemplateService.init();

  logger.core.info('Block Templating queue initialized');

  const port = config.get('pool:port');
  logger.core.info(`Starting Pool JSON-RPC on port ${port}`);
  const stratum = jayson.server(MinerService);
  stratum.tcp().listen(port);
  logger.core.info(`Pool JSON-RPC Listening on port ${port}`);

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


