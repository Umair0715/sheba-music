const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const chatController = require('../controllers/chatController');

router.post('/' , protect , chatController.createChat);
router.get('/my' , protect , chatController.getMyChats);
router.delete('/:chatId' , protect , chatController.deleteChat);
router.get('/single-chat' , protect , chatController.getSingleChat);

module.exports = router;