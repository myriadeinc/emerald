// eslint-disable-next-line new-cap
const router = require('express').Router();
const { check, validationResult } = require('express-validator');




const BlockTemplateService = require('src/services/block.template.service.js');
const AuthMiddleware = require('src/middleware/authentication.middleware.js');
const SapphireApi = require('src/api/sapphire.api.js');

router.post('/',
    AuthMiddleware.validateSharedSecret,
    /**
     * @todo: Add Jobtemplate validating middleware to check fields for req.body
     */
    (req, res) => {
      const blockData = req.body;
      BlockTemplateService.updateBlock(blockData);
      res.sendStatus(200);
    },
);
/**
 * This is meant only as a test endpoint for live debugging and granting of shares,
 * Only does basic validation since it's internal use only
 */
router.post('/forceData', 
  AuthMiddleware.validateSharedSecret,
  [
  check('minerId').exists(),
  check('share').exists(),
  check('difficulty').exists(),
  check('blockHeight').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const data = {
      minerId: req.body.minerId,
      share: req.body.share,
      difficulty: req.body.difficulty,
      blockHeight: req.body.blockHeight,
      time: new Date()
    }
    await SapphireApi.sendShareInfo(data);
    return res.sendStatus(200);
});


module.exports = router;
