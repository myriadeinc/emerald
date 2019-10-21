const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const _ = require('lodash');
const globals = require('src/util/global.js');

const cryptoNoteUtils = require('src/util/cryptonote.js');
/**
 * 
 * Currently broken, we will need to fix
 */
const multiHash = require('mutli-hashing');
const cryptoNight = mutliHash['cryptonight'];
function cryptoNightFast(buf){
    return cryptoNight(Buffer.concat([new Buffer([buf.length]), buf]), true);
}



const VarDiff = globals.VARDIFF;
const diff = globals.refDiff;

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
     * 
     * @returns {BlockTemplate} jobTemplate
     */
    getJob() {
        return JobHelperService.create(BlockTemplateService.getBlock());
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
    submit(req) {

        /*
             minerdata.id = miner uuid
             minerdata.job_id = job id
             minerdata.nonce = nonce
             minerdata.result = resultHash -> the hash of the supposed block
             Reconstruct the block from data,check to see that it matches the sent block
            */
        const minerData = 
            {
                "id": req.params.id,
                "job_id": req.params.job_id,
                "nonce": req.params.nonce,
                "result": req.params.result
            };
        var block = BlockReferenceService.buildBlock();

        if(!BlockReferenceService.checkBlock(block, minerData.result)){
            sapphireApi.sendShareInfo();
            return {};
        }


        if(BlockReferenceService.checkDifficulty()){
            return moneroApi.submit(BlockReferenceService.getVerifiedBlock())
            .then((result) => {
                sapphireApi.sendShareInfo();
                return null;
            });
        }
        else{
            sapphireApi.sendShareInfo();
            return {error: "does not meet difficulty"};

        }


        // Remove the below block after refactoring is completed
        return new Promise((resolve, reject) => {
            //miner, job, blockTemplate, nonce, resultHash
            
            
            const blockTemplate = BlockTemplateService.getBlock();
            const job = getJobById();
            
            var block = constructBlock(blocktemplate,minerData, job);

            const convertedBlob = cryptoNoteUtils.cnUtil.convert_blob(block);

            const algoVariant = 0;
            const blockHashed = cryptoNight(convertedBlob, algoVariant);
            
            if (blockHashed.toString('hex') !== minerdata.result) {
                logger("Bad Hash, penalty to miner");
                resolve("Bad Hash");
                return false;
            }
        
            var hashArray = blockHashed.toJSON().reverse();
            // Diff is a reference from bignum 
            var hashDiff = diff.div(bignum.fromBuffer(new Buffer(hashArray)));
        
            if (hashDiff.ge(blockTemplate.difficulty)){
                moneroApi.submit(block, function(error, result){
                    if (error){
                        sapphireApi.sendShareInfo();
                        resolve("MONERO API ERROR");
                        return false;
                    }
                    else{
                        var blockFastHash = cryptoNightFast(convertedBlob || cryptoNoteUtils.cnUtil.convert_blob(block)).toString('hex');
                        // Send blockfasthash instead
                        sapphireApi.sendShareInfo();                        
                        jobRefresh();
                        resolve("Share Granted");
                        return true;
                    }
                });
            }
        
            else if (hashDiff.lt(job.difficulty)){
                // Miner sent bad block/nonce, this is a bannable offense since XMRig should not be sending any below target difficulty
                sapphireApi.sendShareInfo();
                return false;
            }
            

        })
    }
}


function getLatestBlockTemplate(){
    return 'hexdata';
}

function getCurrentDifficulty(){
    return 10;
}



function getJobById(id){
    blockTemplate = getLatestBlockTemplate();
    uid = '12345';
    newJob = {
        id: uid,
        extraNonce: blockTemplate.extraNonce,
        height: blockTemplate.height,
        difficulty: getCurrentDifficulty(),
        score: getCurrentScore(),
        diffHex: getDiffHex(),
        submissions: []
    };

    return newJob;
}

module.exports = MinerModel;