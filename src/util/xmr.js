const randomx = require('cryptoforknote-util');
const blockUtil = require('cryptonight-hashing');
const bignum = require('bignum');


const Xmr = {
/**
 * bignum for checking difficulty
 */
diff :
bignum('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', 16),

construct_block_blob: (a,b) => {
    return blockUtil.construct_block_blob(a,b,0);
},


}

module.exports = xmr;