const router = require('express').Router();

router.use('/pool', require('src/routes/miner.router.js'));

module.exports = router;