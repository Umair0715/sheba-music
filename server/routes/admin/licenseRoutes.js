const router = require('express').Router();
const licenseController = require('../../controllers/admin/licenseController');
const { protect , isAdmin } = require('../../middlewares/protect');

router.route('/')
    .post(protect , isAdmin , licenseController.createLicense)
    .get(protect , licenseController.getAllLicense)
router.route('/:id')
    .put(protect , isAdmin , licenseController.updateLicense)
    .delete(protect , isAdmin , licenseController.deleteLicense);

module.exports = router;