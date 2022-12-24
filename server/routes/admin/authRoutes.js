const router = require('express').Router();
const authController = require('../../controllers/admin/authController');
// const { protect } = require('../../middlewares/protect');

router.post('/admin/register' , authController.registerAdmin);
router.post('/admin/login' , authController.loginAdmin);

module.exports = router;