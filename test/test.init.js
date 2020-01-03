'use strict';

const path = require('path');

const rootPath = path.resolve(`${__dirname}/../`);
require('app-module-path').addPath(rootPath);

const logger = require('src/util/logger.js');
// initialize config
const configPath = path.resolve(`${rootPath}/config`);
const config = require('nconf')
    .argv()
    .env({ lowerCase: true, separator: '__' })
    .file('testing', { file: `${rootPath}/test/config/testing.json` })
    .file('environment', { file: `${configPath}/${process.env.NODE_ENV}.json` })
    .file('defaults', { file: `${configPath}/default.json` });

// initialize Cache
const cache = require('src/util/cache.js');
cache.init(config.get('cache'));

// initialize Testing MQ
// const mq = require('src/util/mq.js');
// const mqReady = mq.init(config.get('rabbitmq:url'));

// other libs
const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-string'))
    .should();

process.on('unhandledRejection', (reason, promise) => {
    /* eslint-disable no-console */
    console.error('Unhandled promise rejection:'); 
    console.error(reason);
    process.exit(57);
    // If you noticed an exit code of 57, and grepped for it, now you know why.
    /* eslint-enable no-console */
});


module.exports = {
    // mq,
    // mqReady,
    cache,
    config,
    should,
};
