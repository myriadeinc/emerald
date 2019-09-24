'use strict';

const testing = require('../test.init.js');

const MetricsService = require('src/services/metrics.service.js');
const config = require('src/util/config.js');
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-string'))
    .should();

describe('Metrics Service Unit Tests', () => {

    before('Await MQ initialization', () => {
        return testing.mqReady;
    })
    it('Should successfully send a message', () => {
        return MetricsService.broadcast('1', {
            testing: 100
        })
        .then(() =>{
            return testing.mq.channel.consume(config.get('rabbitmq:queue'), (msg) => {
                return new Promise((resolve, reject) => {
                    testing.mq.channel.ack(msg);
                    let data = JSON.parse(msg.content.toString());
                    data.should.not.be.null;
                    data.testing.should.equal(100);
                    data.accountId.should.equal('1');
                    resolve();
                }) 
            });
        })
        .catch(err => {
            console.log(err);
        })
    })
})