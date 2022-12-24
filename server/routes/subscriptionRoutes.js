const router = require('express').Router();
const { getMySubscription , createSubscription , getAllSubscriptions } = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/protect');

router.post('/' , protect , createSubscription)
router.get('/my' , protect , getMySubscription );
router.get('/all' , protect , getAllSubscriptions)

module.exports = router;