const router = require('express').Router();
const { createEventCategory , updateEventCategory , getEventsCategories , deleteEventCategory , getSingleEventCategory } = require('../../controllers/admin/eventCategoryController');
const { protect } = require('../../middlewares/protect');

router.route('/')
    .post(protect , createEventCategory)
    .get(getEventsCategories );

router.route('/:id')
    .put(protect , updateEventCategory)
    .delete(protect , deleteEventCategory)
    .get(getSingleEventCategory);

module.exports = router;