const router = require('express').Router();
const { protect } = require('../../middlewares/protect');
const { createBeatCategory , getBeatCategories , updateBeatCategory , deleteBeatCategory , getSingleBeatCategory } = require('../../controllers/admin/beatsCategoryController');

router.route('/')
    .post(protect , createBeatCategory)
    .get(protect , getBeatCategories)
router.route('/:id')
    .put(protect , updateBeatCategory)
    .get(protect , getSingleBeatCategory)
    .delete(protect , deleteBeatCategory);

module.exports = router;