'use strict';
const bunyan = require('bunyan');

// Later for production we can use LogDNA on the Bunyan stream

const logger = bunyan.createLogger({
  name: 'emerald',
});

module.exports = {
  core: logger.child({component: 'core'}),
  db: logger.child({component: 'db'}),
  auth: logger.child({component: 'auth'}),
  account: logger.child({component: 'account'}),
};