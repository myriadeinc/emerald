const logger = require('src/util/logger.js').miner;
const config = require('src/util/config.js');
const err = require('src/util/error.js');
const cryptonoteUtils = require('src/util/cryptonote.js');
const _ = require('lodash');

const VarDiff = require('src/util/global.js').VARDIFF;

// Replace with rabbitMQ
const rmq = function(){};

const DiamondApi = require('src/api/diamond.api.js');
const diamondApi = new DiamondApi();
MoneroApi = require('src/monero.api');
const moneroApi = new MoneroApi();

const cache = require('src/util/cache.js');

class MinerModel {

    address = null;
    id = null;
    name = null;
    difficulty = config.get('pool:difficulty');
    port=config.get('pool:port');
    shareTimeRing = cryptonoteUtils.ringBuffer(16);
    
    /**
     * Serialize from JSON or JWT token into a Miner instance
     * @param {object} data 
     */
    async constructor(data) {
        
        this.address = data.address;
        this.name = data.name;
        this.id = data.accountId;
    }

    /**
     * 
     * @param {JSON} data The JSON data of a miner that needs to be serialized
     */
    async static serializeJWT(token) {
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


    async recordShareData(blob){
            rmq.push(blob);
    }

    submit(miner, job, blockTemplate, params){
          // From nodejs pool
          let nonce = params.nonce;
          let resultHash = params.result;
          let template = Buffer.alloc(blockTemplate.buffer.length);
          
          blockTemplate.buffer.copy(template);
          template.writeUInt32BE(job.extraNonce, blockTemplate.reserveOffset);
          /**
           * Left over in case we introduce miner proxy functionality (not documented)
           * blockTemplate.buffer.copy(template);
              template.writeUInt32BE(job.extraNonce, blockTemplate.reserveOffset);
              template.writeUInt32BE(params.poolNonce, job.clientPoolLocation);
              template.writeUInt32BE(params.workerNonce, job.clientNonceLocation);
           * 
           * 
           */
          cnBlobType = {};
          // utils.cnUtil -> cryptonote.cnutil
          let shareBuffer = cryptonote.cnutil.construct_block_blob(template, Buffer.from(nonce, 'hex'), cnBlobType);
      
          let convertedBlob;
          let hash;
    
          convertedBlob = cryptonote.cnutil.convert_blob(shareBuffer, cnBlobType);
              let hard_fork_version = convertedBlob[0];
      
              // For randomX
                  hash = cryptonote.cnutil.cryptoNight(convertedBlob, Buffer.from(blockTemplate.seed_hash, 'hex'), cnVariant);
      
          
      
          if (hash.toString('hex') !== resultHash) {
            // miner has Bad hash 
              log('warn', logSystem, 'Bad hash from miner');
              return false;
          }
      
          let hashArray = hash.toByteArray().reverse();
          let hashNum = bignum.fromBuffer(Buffer.from(hashArray));
          let hashDiff = diff1.div(hashNum);
          // time sensitive so cannot promisify right away
          if (hashDiff.ge(blockTemplate.difficulty)){
            // call monero rpc submit block, share buffer will be converted to hex string
             moneroApi.submitblock(shareBuffer, function(error, result){
                  if (error){
                    // Log error
                      recordShareData(Set([miner, job, hashDiff.toString()]));
                  }
                  else{
                      let blockFastHash = cryptonote.get_block_id(shareBuffer, cnBlobType).toString('hex');
                      // Log success
                      recordShareData(Set([miner, job, hashDiff.toString(), true, blockFastHash, shareType, blockTemplate]));
                      // Link this function !!
                      jobRefresh();
                      return true;
                  }
              });
          }
      
          else if (hashDiff.lt(job.difficulty)){
              // Log low difficulty, no share granted
              return ;
          }
          else{
              recordShareData(Set([miner, job, hashDiff.toString()]));
          }
          return false;

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


export default MinerModel;