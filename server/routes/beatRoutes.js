const router = require('express').Router();
const beatController = require('../controllers/beatController');
const { protect , restrictTo } = require('../middlewares/protect');


router.route('/')
    .post( protect , restrictTo(3) , beatController.createBeat)
    .get( beatController.getBeats);
router.route('/:id')
    .put( protect , restrictTo(3) , beatController.updateBeat)
    .delete(protect , restrictTo(3) , beatController.deleteBeat)
    .get(beatController.getSingleBeat);
router.get('/my' , protect , restrictTo(3) , beatController.getMyBeats);

module.exports = router;