const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js');
const _ = require('lodash');

const VarDiff = require('src/util/global.js').VARDIFF;

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();


class MinerModel {

    address = null;
    id = null;
    workerName = null;
    difficulty = null;
    port=null;
    shareTimeRing = cryptonoteUtils.ringBuffer(16);
    
    /**
     * Serialize from JSON or JWT token into a Miner instance
     * @param {object} options 
     * @param {token} jwt 
     */
    async constructor(currPort, options={}, jwt=null) {
        if (jwt){
            // Handle to object form JWT token
            this.address = jwt.address;
            this.id = jwt.userId;
            this.workerName = jwt.workerName;
            this.port = jwt.connectionPort;
            this.difficulty = jwt.difficulty ? jwt.difficulty : null;
        }
        else if (options){
            this.address = options.address;
            this.id = res.id;
            this.workerName = res.workerName;
            this.difficulty = options.difficulty ? options.difficulty : null;
        }
        else {
            throw err.Miner.Instantiation();
        }
    }

    /**
     * 
     * @param {JSON} data The JSON data of a miner that needs to be serialized
     */
    async static serializeMiner(data) {

    }



    getJob() {

    }

    getTargetHex() {}

    /**
     * Retarget difficulty
     * @param {time} now 
     */
    retarget(now) {
        let options = config.get('pool:ports:varDiff');

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


export default MinerModel;