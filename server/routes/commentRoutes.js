const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const commentController = require('../controllers/commentController');

router.post('/' , protect , commentController.createComment)
router.delete('/:commentId' , protect , commentController.deleteComment);
router.get('/:postId' , protect , commentController.getSinglePostComments);


module.exports = router;