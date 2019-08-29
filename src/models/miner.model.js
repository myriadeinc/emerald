const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js')

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
    async constructor(options={}, jwt=null) {
        if (jwt){
            // Handle to object form JWT token
            this.address = jwt.address;
            this.id = jwt.userId;
            this.workerName = jwt.workerName;
            this.port = jwt.connectionPort;
        }
        else if (options){
            this.address = options.address;
            let res = await this.diamondApi.getUser(address=this.address);
            this.id = res.id;
            this.workerName = res.workerName;

        }
        else {
            throw err.Miner.Instantiation();
        }

    }


    getJob() {}

    getTargetHex() {}

    retarget() {}
    
}

export default MinerModel;