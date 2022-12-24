const router = require('express').Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/protect');

router.post('/google-login' , authController.googleLogin);
router.post('/facebook-login' , authController.facebookLogin);
router.post('/register' , authController.register);
router.post('/login' , authController.login);
router.get('/logout' , protect , authController.logout );
router.post('/send-otp' , authController.sendOtp);
router.post('/verify-otp' , authController.verifyOtp);
router.post('/reset-password' , authController.resetPassword);
router.post('/phone-login' , authController.phoneLogin);
router.post('/verify-email' , protect , authController.verifyEmail);

//sendmail for forgot password 
// router.post('/send-verification-mail', protect , authController.sendVerificationMail);
// router.post('/verify-phone-number', protect , authController.verifyPhoneNumber );

module.exports = router;