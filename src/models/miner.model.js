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
        this.id = data.accountId;
        this.difficulty = config.get('pool:difficulty')
        this.port=config.get('pool:port')
        this.shareTimeRing = cryptonoteUtils.ringBuffer(16);
    }

    /**
     * 
     * @param {JSON} data The JSON data of a miner that needs to be serialized
     */
    static async serializeJWT(token) {
        try{
            let tok = await diamondApi.decodeAndVerifyToken(token)
            data.accountId = tok.sub
            data = {
                accountId: tok.sub,
                ...tok.account

            }
            return new MinerModel(data);
        }
        catch(e){
            logger.core.error(e);
            return null;
        }
    }



    getJob() {

    }

    getTargetHex() {}

    /**
     * Retarget difficulty
     * @param {time} now 
     */
    retarget(now) {
        let options = config.get('pool:varDiff');

        let sinceLast = now - this.lastShareTime;
        let decreaser = sinceLast > VarDiff.tMax;

        let avg = this.shareTimeRing.avg(decreaser ? sinceLast : null);
        let newDiff;

        let direction;

        if (avg > VarDiff.tMax && this.difficulty > options.minDiff){
            newDiff = options.targetTime / avg * this.difficulty;
            newDiff = newDiff > options.minDiff ? newDiff : options.minDiff;
            direction = -1;
        }
        else if (avg < VarDiff.tMin && this.difficulty < options.maxDiff){
            newDiff = options.targetTime / avg * this.difficulty;
            newDiff = newDiff < options.maxDiff ? newDiff : options.maxDiff;
            direction = 1;
        }
        else{
            return;
        }
    }

    _setNewDiff(){
        // Send request to diamond 

    }
    
}


module.exports = MinerModel;