const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js');
const _ = require('lodash');

const VarDiff = require('src/util/global.js').VARDIFF;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();
const cache = require('src/util/cache.js');

class MinerModel {    
    /**
     * Serialize from JSON or JWT token into a Miner instance
     * @param {object} data 
     */
    constructor(data) {       
        this.address = data.address;
        this.name = data.name;
        this.id = data.id;
    }

    /**
     * 
     * @param {JSON} data The JSON data of a miner that needs to be serialized
     */
    static serializeJWT(tok) {
        try{           
            return new MinerModel(tok.account);
        }
        catch(e){
            logger.core.error(e);
            return null;
        }
    }

    /**
     * @returns {BlockTemplate} jobTemplate
     */
    getJob() {
        return new Promise((resolve, reject) => {
            resolve('Boilerplate for Miner::getJob');
        })
    }

    /**
     * @param {BlockTemplate} blockTemplate 
     */
    submit(blockTemplate) {
        return new Promise((resolve, reject) => {
            resolve('Boilerplate for Miner::submit');
        })
    }
}


module.exports = MinerModel;