const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const buyBeatController = require('../controllers/buyBeatController');

router.post('/' , protect , buyBeatController.buyBeat);
router.get('/my' , protect , buyBeatController.getMyBuyBeats);


module.exports = router;