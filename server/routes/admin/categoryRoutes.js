const router = require('express').Router();
const categoryController = require('../../controllers/admin/categoryController');
const { protect , isAdmin } = require('../../middlewares/protect');


router.route('/' )
    .post(protect , categoryController.createCategory)
    .get( categoryController.getCategories);

router.route('/:id')
    .put(protect , categoryController.updateCategory)
    .delete(protect , categoryController.deleteCategory)
    .get(categoryController.getSingleCategory);
    
module.exports = router;