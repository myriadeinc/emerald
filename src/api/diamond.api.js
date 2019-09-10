'use strict';
const config = require('src/util/config.js');
const axios = require('axios');
const Err = require('src/util/error.js').Miner;
const jwt = require('jsonwebtoken');
const logger = require('src/util/logger.js');

class DiamondApi {
    constructor() {
        this.url = config.get('diamond:host');
        this.sharedSecret = config.get('service:shared_secret');
    }

    /**
     * Performs the login functionality
     * @param {object} data has username and password 
     * @returns an promise of an access token
     */ 
    login(address, email) {
        return axios.post(`${this.url}/v1/account/address-login`,{
            address,
            email
        },{
                headers: {
                    Authorization: `SharedSecret ${this.sharedSecret}`
                }
        })
        .then((res) => {
            return res.accessToken;
        })
        .catch(err => {
            logger.core.err(err);
            throw Err.login;
        });
    }

    decodeAndVerifyToken(token) {
        return new Promise((resolve, reject) => {
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, config.get('diamond:public_key'));
            } catch (err) {
                return reject(err);
            }
            return resolve(_.omit(decodedToken, ['iat', 'jti']));
        });
    }

    /**
     * 
     * @param {UUID} userId 
     * @param {Hex} address 
     * @returns An user JSON
     */
    async getUser(userId=null, address=null){

    }

}

export default DiamondApi;