const router = require('express').Router(); 
const { protect } = require('../middlewares/protect');
const userController = require('../controllers/userController');


router.get('/profile' , protect , userController.getProfile);
router.put('/change-password' , protect , userController.changePassword);
router.put('/update-user' , protect , userController.updateUser);
router.delete('/delete-my-account' , protect , userController.deleteMyAccount);
router.put('/change-profile' , protect , userController.changeProfileImage);
router.put('/change-cover' , protect , userController.changeCoverImage);
router.post('/fcm-token' , protect , userController.setFcmToken);

module.exports = router;