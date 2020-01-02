const router = require('express').Router();

router.use('/block', require('src/routes/block.template.router.js'));

module.exports = router;
