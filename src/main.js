const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');

// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript
let servers = {}

const main = async () => {

    logger.core.info('Starting Emerald')
    const pool = require('src/pool.js');
    const ports = config.get('pool:ports');
    ports.forEach(p => {
        let server = pool.listen(p);
        logger.core.info(`Pool listening on port ${p}`);
        servers[p] = server;
    });
        
};

const gracefulShutdown = () => {
    Object.keys(servers).forEach(port => {
        let server = servers[port];
        server.close(async () => {
            // await some DB shut down
            console.log(`${config.get('service')} is gracefully shutting down on port ${port}`);
            process.exit(0);
        });
    })
    
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
  console.log('Unhandled promise rejection!', err);
  process.exit(1);
});


main().catch(err => {
    logger.core.error(err);
    process.exit(1);
});


