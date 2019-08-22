// For strantum compliance refer to https://github.com/xmrig/xmrig-proxy/blob/master/doc/STRATUM.md
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('src/router.js');

const poolSever = express();
poolSever.use(bodyParser.urlencoded({extended: true}));
poolSever.use(bodyParser.json());

poolSever.use((req, res, next) => {
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

poolSever.enable('trust proxy');

poolSever.use('/v1/', routes);

poolSever.get('/healthcheck', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = poolSever;
