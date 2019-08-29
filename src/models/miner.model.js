const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js')

class MinerModel {

    address = null;
    id = null;
    workerName = null;
    difficulty = null;
    
    constructor(options={}, jwt=null) {
        if (jwt){
            // Handle to object form JWT token
        }
        else if (options){

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