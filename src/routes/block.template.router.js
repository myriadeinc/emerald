// eslint-disable-next-line new-cap
const router = require('express').Router();
const BlockTemplateService = require('src/services/block.template.service.js');
const AuthMiddleware = require('src/middleware/authentication.middleware.js');

router.post('/',
  AuthMiddleware.validateSharedSecret,
  /**
   * @todo: Add Jobtemplate validating middleware to check fields for req.body
   */
  (req, res) => {
    const blockData = req.body;
    BlockTemplateService.updateBlock(blockData);
    console.dir(blockData.height)
    res.sendStatus(200);
  },
);


module.exports = router;
