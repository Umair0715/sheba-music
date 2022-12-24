const router = require('express').Router();
const { protect , isAdmin } = require('../../middlewares/protect');
const { createPackage , getAllPackages , getSinglePackage , updatePackage , deletePackage } = require('../../controllers/admin/packageController');

router.route('/')
    .post(protect , createPackage)
    .get(protect , getAllPackages)

router.route('/:id')
    .get(protect , getSinglePackage)
    .put(protect , updatePackage)
    .delete(protect , deletePackage);

module.exports = router;