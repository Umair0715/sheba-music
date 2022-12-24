const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const { createCommentLike } = require('../controllers/commentLikeController');

router.post('/' , protect , createCommentLike);

module.exports = router;