// 'use strict';

// const testing = require('../test.init.js');
// const crypto = require('crypto')

// const MoneroApi = require('src/api/monero.api.js');

/**
 * Get job manually from job service, then mine to find a nonce
 * 
 */

// const chai = require('chai')
//     .use(require('chai-as-promised'))
//     .use(require('chai-string'))
//     .should();
/*

TODO: Finish test


describe('Miner role and submission of block', () => {
    // before('Add login functionality here', () => {
    //     return true;
    // })
    it('Should successfully mine a block and submit according to difficulty', () => {
        return moneroApi.getBlockTemplate();
        }).then((blockTemplate)=>{
            console.dir(blockTemplate);
            const block = new Buffer(blockTemplate.buffer.length);
            blockTemplate.buffer.copy(block);

            const nonce = 'c8241';

            const blob = xmr.construct_block_blob(
                blockTemplate,
                new Buffer(nonce,'hex')
            );
            console.dir(xmrHash.randomx(blob));
            return moneroApi.submit(blob.toString('hex'));
        }).then((reply)=>{

            chai
            console.dir(reply);
        })
        .catch(err => {
            console.log(err);
        });

});


function miniMiner(blockTemplate){
    const nonce = crypto.randomBytes(4).toString('hex');
    const block = new Buffer(bloclTemplate.buffer.length);
    blockTemplate.buffer.copy(block);
    const blob = xmr.construct_block_blob();
    const hash = xmr.randomx(blob);
    while(hash){}

    return nonce;

}
*/