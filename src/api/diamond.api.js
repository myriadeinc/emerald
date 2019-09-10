'use strict';
const config = require('src/util/config.js');
const axios = require('axios');
const err = require('src/util/error.js').Miner;

class DiamondApi {
    constructor() {
        this.url = config.get('diamond:host');
        this.sharedSecret = config.get('service:shared_secret');
    }

    /**
     * Performs the login functionality
     * @param {object} data has username and password 
     * @returns an access token
     */ 
    async login(address, email) {
        let res;
        try{
            res = await axios.post(`${this.url}/v1/account/address-login`,{
                address,
                email
            },{
                    headers: {
                        Authorization: `SharedSecret ${this.sharedSecret}`
                    }
            })
        }
        catch(e){
            throw err.login;
        }
        return res.accessToken;
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