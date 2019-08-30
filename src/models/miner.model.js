const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js');
const _ = require('lodash');

const DiamondApi = require('src/api/diamond.api.js');

class MinerModel {

    address = null;
    id = null;
    workerName = null;
    difficulty = null;
    port=null;

    diamondApi = new DiamondApi();
    
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
            let res = await this.diamondApi.getUser(address=this.address);
            this.id = res.id;
            this.workerName = res.workerName;
            this.difficulty = options.difficulty ? options.difficulty : null;
        }
        else {
            throw err.Miner.Instantiation();
        }
        this.difficulty = this.difficulty ? this.difficulty : _.filter(
            config.get('pool:ports'), 
            ['port', currPort]).difficulty;
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

    }

    _setNewDiff(){
        
    }
    
}

export default MinerModel;