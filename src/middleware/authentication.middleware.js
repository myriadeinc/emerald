'use strict';

const config = require('src/util/config.js');

const secret = config.get('service:shared_secret');

const AuthMiddleware = {

  validateSharedSecret: (req, res, next) => {
    if (req.header.authorization) {
      const authArr = req.header.authorization.split();
      if ('shared_secret' == authArr[0] && secret == authArr[1]) {
        next();
      }
    }
    res.status(403).send('Unauthorized');
  },
};

module.exports = AuthMiddleware;
