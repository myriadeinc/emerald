const config = require('src/util/config.js');
const jsonrpc = require('json-rpc-protocol');

// API interface to interact with Monero Daemon via JSON RPC
class MoneroApi {

    constructor() {
        this.__daemon_host = config.get('monero:daemon:host') ? config.get('monero:daemon:host'): "0.0.0.0";
        this.__wallet_host = config.get('monero:wallet:host') ? config.get('monero:wallet:host') : "0.0.0.0";
    }

    /**
     * @description gets the next block template from the Daemon : promisified
     * @param {object} params object for configuring the next template
     * @returns {object}  Returns an object for the block template
     */
    getBlockTemplate(params=null) {
        return new Promise((resolve, reject) => {

        });
    }
    
    /**
     * @description gets the header of the last block : promisified
     * @returns {object} Returns the header of the last block
     */
    getLastBlockHeader() {
        return new Promise((resolve, reject) => {

        });
    }

    /**
     * @description Submit a block to the daemon
     * @param {object} block 
     */
    submitBlock(block) {
        return new Promise((resolve, reject) => {

        });
    }
}

export default MoneroApi;