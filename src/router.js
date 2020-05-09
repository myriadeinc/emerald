const router = require('express').Router();
const config = require('src/util/config.js');

router.use('/block', require('src/routes/block.template.router.js'));

module.exports = router;
