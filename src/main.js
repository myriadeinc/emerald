const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');

const cache = require('src/util/cache.js');
const mq = require('src/util/mq.js');
// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript
let server;

const main = async () => {
  logger.core.info(`Starting Emerald for ${config.get('pool:desc')}`);
  
  logger.core.info('Initializing cache DB');
  cache.init(config.get('cache'));
  logger.core.info('Cache initialized');

  logger.core.info('Initializing messaging queue RabbitMQ');
  mq.init(config.get('rabbitmq:url'));
  logger.core.info('Messaging queue initialized');

  const pool = require('src/pool.js');
  const port = config.get('pool:port');
  server = pool.listen(port, () => {
    logger.core.info(`Listening on port ${port}`)
  });

};

const gracefulShutdown = () => {
  server.close(async () => {
    // await some DB shut down
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


