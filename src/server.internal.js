const express = require('express');
const bodyParser = require('body-parser');

const routes = require('src/router.js');

const internalServer = express();
internalServer.use(bodyParser.urlencoded({extended: true}));
internalServer.use(bodyParser.json());

internalServer.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Cache-Control, Pragma, Origin, Authorization,' +
      'Content-Type, X-Requested-With');
  res.header('Access-Control-Allow-Methods',
      'POST, GET, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

internalServer.enable('trust proxy');

internalServer.use('/v1/', routes);

internalServer.get('/healthcheck', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = internalServer;