const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const followController = require('../controllers/followController');

router.route('/')
    .post( protect , followController.createFollower)
    
router.get('/my-followers' , protect , followController.getMyFollowers)
router.get('/my-followings' , protect , followController.getMyFollowings);
router.get('/get-followers/:userId' , protect , followController.getSingleUserFollowers);
router.get('/get-followings/:userId' , protect , followController.getSingleUserFollowings);
router.delete('/:userId' , protect , followController.unFollowUser)




module.exports = router;