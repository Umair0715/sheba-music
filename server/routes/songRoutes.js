const router = require('express').Router();
const songController = require('../controllers/songController');
const { protect } = require('../middlewares/protect');


router.route('/')
    .post( protect , songController.createSong )
    .get(songController.getSongs);
    
router.route('/:id')
    .put(protect , songController.updateSong)
    .delete(protect , songController.deleteSong)
    .get(songController.getSingleSong)

module.exports = router;