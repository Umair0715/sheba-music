const router = require('express').Router();
const fcmController = require('../controllers/fcmController');
const { protect } = require('../middlewares/protect');

router.route('/')
    .post( protect , fcmController.createFcmToken)
    .get(protect , fcmController.getMyFcmToken);
module.exports = router;