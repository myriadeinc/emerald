const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const xmr = require('src/util/xmr.js');
const err = require('src/util/error.js');
const _ = require('lodash');
const globals = require('src/util/global.js');

/**
 * 
 * Currently broken, we will need to fix
 */


const bignum = require('bignum');

const JobHelperService = require('src/services/job.helper.service.js');
const BlockTemplateService = require('src/services/block.template.service.js');

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();

const MoneroApi = require('src/api/monero.api.js');
const moneroApi = new MoneroApi();

const SapphireApi = require('src/api/monero.api.js');
const sapphireApi = new SapphireApi();

//key value job 

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
    static fromToken(tok) {
        try{           
            return new MinerModel(tok.account);
        }
        catch(e){
            logger.core.error(e);
            return null;
        }
    }

    /**
     * 
     * @returns {BlockTemplate} jobTemplate
     */
    getJob() {
        let job = JobHelperService.create(BlockTemplateService.getBlockTemplate());
        return {
            job_id: job.job_id,
            params: {
                blob: job.blob
            }
        });
    }
    
    /**
     * 
     * @Example Request
     * "id": 2,
     * "jsonrpc": "2.0",
     * "method": "submit",
     * "params": {
     * "id": "1be0b7b6-b15a-47be-a17d-46b2911cf7d0",
     * "job_id": "4BiGm3/RgGQzgkTI/xV0smdA+EGZ",
     * "nonce": "d0030040",
     * "result": "e1364b8782719d7683e2ccd3d8f724bc59dfa780a9e960e7c0e0046acdb40100"
     * }
     * @param {request} req
     */ 
    async submit(data) {
        /*
            minerdata.id = miner uuid
            minerdata.job_id = job id
            minerdata.nonce = nonce
            minerdata.result = resultHash -> the hash of the supposed block
            Reconstruct the block from data,check to see that it matches the sent block
            */
        const minerData = {
            id: this.id,
            job_id: data.job_id,
            nonce: data.nonce,
            results: data.result
        };
        // Get the current block template and create a block with the provided nonce
        let block = BlockReferenceService.buildBlock(minerData);
        let job = await JobHelperService.getFromId(minerData.job_id);

        // Convert block into blob, then hash with randomx and compare with the hash that the miner sent
        if(!BlockReferenceService.checkBlock(block, minerData.result)){
            sapphireApi.sendShareInfo("Bad Block hash provided, penalty to miner");
            return {};
        }
        // If the difficulty check passes we submit the block
        if(BlockReferenceService.checkDifficulty(job.difficulty,block)){
            return moneroApi.submit(block)
            .then((result) => {
                sapphireApi.sendShareInfo("good block provided, share given to miner");
                return null;
            });
        }
        else{
            sapphireApi.sendShareInfo();
            return {error: "does not meet difficulty"};
        }
    }
}

module.exports = MinerModel;