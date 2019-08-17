const PoolService = require('src/services/pool.service.js');
const spawner = {
    pool: PoolService.spawn,
    all: () => {
        PoolService.spwan()
    }

}

module.exports = spawner;