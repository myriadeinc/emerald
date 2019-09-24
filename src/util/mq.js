'use strict';

const amq = require('amqplib');

const logger = require('src/util/logger.js').mq;

const queue = 'MinerMetrics';
let channel;

const MQ = {

    init: (url) => {
        return amq.connect(url)
        .then(conn => {
            return conn.createChannel();
        })
        .then(ch => {
            channel = ch;
            return channel.assertQueue(queue);
        })
        .catch(logger.error);
    },

    send: (msg) => {
        return channel.assertQueue(queue)
        .then(ok => {
            logger.info(`Sending: ${msg}\n on queue ${queue}`);
            return channel.sendToQueue(queue, msg);
        })
        .then(() => {
            return 0;
        })
        .catch(err => {
            logger.error(err);
            logger.error(`Error occured while sending: \n ${msg}`);
            return -1;
        });
    },

    registerConsumer: (cb) => {
        return channel.assertQueue(queue)
        .then(ok => {
            return channel.consume(queue, (msg) => {
                if (null !== msg){
                    channel.ack(msg);
                    logger.info(`Consuming message: ${msg.content.toString()}\n from queue ${queue}`);
                    cb(msg.content);
                }
            });
        })
        .cathc(err => {
            logger.error(err);
        });
    }

}

module.exports = MQ;