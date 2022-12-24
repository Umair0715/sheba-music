const router = require('express').Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/protect');

router.route('/:chatId')
    .get(protect , messageController.getMessages);
router.post('/' , protect , messageController.sendMessage);

module.exports = router;