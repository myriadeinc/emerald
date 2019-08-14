const cluster = require('cluster');
const fs = require('fs');
const os = require('os');

const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);

const config = require('src/util/config.js');

const handleWorker = () => {
    switch(process.env.workerType){
        case 'pool':
            break;
    }
}

const main = () => {
    if (cluster.isWorker){
        handleWorker();
    }
}




