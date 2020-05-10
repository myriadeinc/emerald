const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const SapphireApi = require('src/api/sapphire.api.js');

/**
 * This is meant only as a test endpoint for live debugging and granting of shares,
 * Only does basic validation since it's internal use only
 */
router.post('/forceData', 
  [
  check('minerId').exists(),
  check('share').exists(),
  check('difficulty').exists(),
  check('blockHeight').exists(),
  ], async (req, res) => {
    console.log('--------------------------------------------- Request received ------------------------------------');
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
