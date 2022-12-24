const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/protect');

router.put('/:notificationId' , protect , notificationController.updateNotification);
router.get('/' , protect , notificationController.getMyNotifications);

module.exports = router;