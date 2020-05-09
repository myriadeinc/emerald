const path = require('path');
const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);
// We use this file in the event of mocking data, setting a RabbitMQ connection to Sapphire
const mq = require('src/util/mq.js');
const config = require('src/util/config.js');
const logger = require('src/util/logger.js');


let server;


const mock = async() => {
    logger.core.info(`Initializing messaging queue RabbitMQ: ${config.get('rabbitmq:url')}`);
    await mq.init(config.get('rabbitmq:url'));


  const internalPort = config.get('service:port');
  const internalServer = require('src/server.internal.js');

  server = internalServer.listen(internalPort, () => {
    logger.core.info(`Internal server listening on port ${internalPort}`);
  });

}


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
  
  
  mock().catch((err) => {
    logger.core.error(err);
    process.exit(1);
  });