'use strict';
const config = require('src/util/config.js');

class DiamondApi {
    constructor() {
        this.url = config.get('diamond:host');
    }

    /**
     * 
     * @param {object} data has username and password 
     */
    login(data) {
        
    }


}

export default DiamondApi;