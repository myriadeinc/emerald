'use strict';
const config = require('src/util/config.js');

class DiamondApi {
    constructor() {
        this.url = config.get('diamond:host');
    }

    /**
     * Performs the login functionality
     * @param {object} data has username and password 
     */ 
    login(data) {
        
    }

    /**
     * 
     * @param {UUID} userId 
     * @param {Hex} address 
     */
    async getUser(userId=null, address=null){

    }

}

export default DiamondApi;