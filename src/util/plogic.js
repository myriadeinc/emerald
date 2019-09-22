'use strict';
/**
 * Utilities for mining pool logic, 
 * this is temporary until we move to the appropriate routes
 * minerSubmitsBlock() should go into the miner middleware once ready
 */

moneroApi = require('src/monero.api');
const cache = require('src/util/cache');
const cryptonote = require('src/util/cryptonote');
/**
 * @Note
 * @Documentation
 * @description
 * We will update the miner profile in redis with the appropriate amount of shares
 * For now, a cron job should be running to periodically submit shares to sapphire
 * Ideally we should at first separate traditional and fortune mining to minimize code complexity (traditional requires establishing trust, ban system, etc)
 * In terms of share grant policy, as we are creating a system first and foremost for fortune mining, we will siply weigh shares by time until a more robust solution is created
 * These comments are to be moved to proper documentation (TBD)
 * 
 * blockTemplate should be provided
 */
function minerSubmitsBlock(miner, job, blockTemplate, params){

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
                      recordShareData(miner, job, hashDiff.toString());
                  }
                  else{
                      let blockFastHash = cryptonote.get_block_id(shareBuffer, cnBlobType).toString('hex');
                      // Log success
                      recordShareData(miner, job, hashDiff.toString(), true, blockFastHash, shareType, blockTemplate);
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
              recordShareData(miner, job, hashDiff.toString());
          }
          return false;
}



function recordShareData(payload){
  cache.put(payload);
}


module.exports = {



};
