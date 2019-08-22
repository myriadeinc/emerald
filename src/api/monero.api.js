'use strict';
const config = require('src/util/config.js');
const jsonrpc = require('json-rpc-client');
const logger = require('src/util/logger.js').monero;
const BlockTemplate = require('src/models/block.template.model.js');

// API interface to interact with Monero Daemon via JSON RPC
class MoneroApi {

    constructor() {

        this.__daemon_host = config.get('monero:daemon:host') ? config.get('monero:daemon:host'): "0.0.0.0";
        this.__daemon_port = config.get('monero:daemon:port') ? config.get('monero:daemon:port') : 5857;
        this.__wallet_host = config.get('monero:wallet:host') ? config.get('monero:wallet:host') : "0.0.0.0";
        this.__rpc_client = new jsonrpc({
            host: this.__daemon_host,
            port: this.__daemon_port
        })
        try{
            this.__rpc_client.connect()
        }
        catch(e){
            logger.error(e);
        }
    }

    /**
     * @description gets the next block template from the Daemon : promisified
     * @param {object} params object for configuring the next template
     * @returns {object}  Returns an object for the block template
     */
    async getBlockTemplate() {
        try{
            let res = await this.__rpc_client.send('getblocktemplate', {
                reserve_size: 17, 
                wallet_address: config.get('pool:poolAddress')
            });
            let blockTemplate = new BlockTemplate(res);
            return blockTemplate;
        }
        catch(e){
            logger.error(e);
        }
        
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