'use strict';

const cache = require('src/util/cache.js');
const strikeLimit = 5;


const BanService = {

    /**
     * True -> Miner is banned
     * False -> Miner is not banned
     */
    checkBan : (id) => {
        return cache.get(id,"strikes") > strikeLimit;
    },
    addStrike : (id) => {
        const strikes = cache.get(id,"strikes") || 0;
        cache.put(id,++strikes,"strikes");

    }

}

module.exports = BanService;