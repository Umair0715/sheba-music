const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const likeController = require('../controllers/likeController');

router.post('/' , protect , likeController.createLike);

router.get('/songs' , protect , likeController.getMyLikedSongs);
router.get('/beats' , protect , likeController.getMyLikedBeats);

router.get('/:postId' , protect , likeController.getPostLikes);


module.exports = router;