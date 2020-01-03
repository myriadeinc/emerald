'use strict';
const _ = require('lodash');
const config = require('src/util/config.js');
const axios = require('axios');
const Err = require('src/util/error.js').Miner;
const jwt = require('jsonwebtoken');
const logger = require('src/util/logger.js');

class DiamondApi {
  constructor() {
    this.url = config.get('diamond:host');
    this.port = config.get('diamond:port');
    this.sharedSecret = config.get('service:shared_secret');
    logger.core.info(`Diamond API instantiated on ${this.url}`);
  }

  /**
   * Performs the login functionality
   * @param {object} data has username and password
   * @return an promise of an access token
   */
  login(address, password) {
    logger.core.info(`Login Proxy for ${address}`);
    return axios({
      url: `http://${this.url}:${this.port}/v1/account/address-login`,
      method: 'post',
      data: {
        address,
        password,
      },
      headers: {
        Authorization: `SharedSecret ${this.sharedSecret}`,
      },
    })
    .then((res) => {
      return res.data.accessToken;
    })
    .catch((err) => {
      logger.core.error(err);
    });
  }

  decodeAndVerifyToken(token) {
    return new Promise((resolve, reject) => {
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, config.get('diamond:public_key'));
      } catch (err) {
        logger.core.error(err);
        return reject(err);
      }
      return resolve(_.omit(decodedToken, ['iat', 'jti']));
    });
  }

  /** 
   *
   * @param {UUID} userId
   * @param {Hex} address
   * @return An user JSON
   */
  async getUser(userId=null, address=null) {

  }
}

module.exports = DiamondApi;
