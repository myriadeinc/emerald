const mq = require('src/util/mq.js');

const MetricsServices = {

    broadcast: (minerId, metrics) => {
        const msg = {
            accountId: minerId,
            ...metrics
        }
        return mq.send(msg)
        .then((res) => {
            if (-1 == res) {
                // Soft handle failure
                //  Should probably shove this in the cache for now... and try again later with CRON job
            }
        })
    }
}

module.exports = MetricsServices;