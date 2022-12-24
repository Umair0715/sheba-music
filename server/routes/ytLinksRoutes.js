const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const ytLinksController = require('../controllers/ytLinksController');

router.route('/')
    .post(protect , ytLinksController.createYoutubeLink)
    .get(protect , ytLinksController.getMyYoutubeLinks)
router.route('/:id')
    .put(protect , ytLinksController.updateYoutubeLink)
    .delete(protect , ytLinksController.deleteYoutubeLink);

module.exports = router;