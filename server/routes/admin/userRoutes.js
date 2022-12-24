const router = require('express').Router();
const { protect } = require('../../middlewares/protect');
const userController = require('../../controllers/admin/userController');

router.get('/all' , protect  , userController.getAllUsers );
router.get('/artists' , protect  , userController.getArtists);
router.get('/beatProducers' , protect  , userController.getBeatProducers);
router.get('/guests' , protect  , userController.getGuestUsers);
router.get('/songWriters' , protect  , userController.getSongWriters);
router.get('/influencers' , protect  , userController.getInfluencers);
router.route('/:id')
    .get(protect  , userController.getUserDetails)
    .delete(protect  , userController.deleteUser);

module.exports = router;