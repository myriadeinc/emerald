const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');
//onst spawner = require('src/util/spawner.js');

// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript


const main = () => {
    return new Promise((resolve, reject) => {
        logger.core.info('Starting Emerald')
        
        
        while(true){
            
        }
    })
    
};

main().catch(err => {
    logger.core.error(err);
    process.exit(1);
});


