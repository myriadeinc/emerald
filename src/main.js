const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');
const logger = require('src/util/logger.js');

// Eventually refactor when migrating to K8 so that every pod is a worker with a master pod
//  instead of using cluster module from javascript
const handleWorker = () => {
    switch(process.env.workerType){
        case 'pool':
            break;
    }
};

const main = () => {
    if (cluster.isWorker){
        handleWorker();
    }
    else if (config.get('pool:singleThread')){

    }
    else {

    }
};

main() 
.cath(err => {
    logger.core.error(err);
    process.exit(1);
});


