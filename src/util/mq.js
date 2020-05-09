'use strict';
const amq = require('amqplib');

const logger = require('src/util/logger.js').mq;
const config = require('src/util/config.js');

const queue = config.get('rabbitmq:queue') || 'Miner::Metrics';

let channel;

const toBuffer = (obj) => {
  let str = obj;
  if ('string' !== typeof myVar) {
    str = JSON.stringify(obj);
  }
  const buff = Buffer.from(str, 'utf8');
  return buff;
};

const MQ = {
  channel,
  init: (url) => {
    return amq.connect(url)
      .then((conn) => {
        return conn.createChannel();
      })
      .then((ch) => {
        MQ.channel = ch;
        logger.info("Messaging Queue Initialized!")
        return true;
      })
      .catch(err => {
        logger.error("Could not connect to RabbitMQ!")
        logger.error(err);
      });
  },

  send: (msg) => {
    return MQ.channel.assertQueue(queue)
      .then((ok) => {
        if (config.get("rabbitmq:debug")) {
          logger.info(`Sending data \n on queue ${queue} :`);
          logger.info(msg);
        }
        return MQ.channel.sendToQueue(queue, toBuffer(msg));
      })
      .then(() => {
        return 0;
      })
      .catch((err) => {
        logger.error(err);
        logger.error(`Error occured while sending: \n ${msg}`);
        return -1;
      });
  },

  registerConsumer: (cb) => {
    return MQ.channel.assertQueue(queue)
      .then((ok) => {
        return MQ.channel.consume(queue, (msg) => {
          if (null !== msg) {
            MQ.channel.ack(msg);
            logger.info(`Consuming message: ${msg.content.toString()}\n from queue ${queue}`);
            cb(JSON.parse(msg.content.toString()));
          }
        });
      })
      .catch((err) => {
        logger.error(err);
      });
  },

  close: () => {

    return MQ.channel.close.then(() => { return amq.close(); });
  }
};

module.exports = MQ;
