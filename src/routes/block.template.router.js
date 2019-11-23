const router = require('express').Router();

const BlockTemplateService = require('src/services/block.template.service.js');
const AuthMiddleware = require('src/middleware/authentication.middleware.js');

router.post('/',
    AuthMiddleware.validateSharedSecret,
    (req, res) => {
      const blockData = req.body.blockData;
      BlockTemplateService.updateBlock(blockData);
      res.sendStatus(200);
    },
);

module.exports = router;
