const router = require('express').Router();

router.use('/pool', require('src/routes/miner.router.js'));
router.use('/block', require('src/routes/block.template.router.js'));

module.exports = router;
