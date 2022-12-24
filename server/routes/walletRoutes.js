const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const walletController = require('../controllers/walletController');

router.route('/')
    .post(protect , walletController.createWallet)
    .get(protect , walletController.getMyWallet);
router.route('/:id')
    .delete(protect , walletController.deleteWallet)
    .get(protect , walletController.getSingleUserWallet);

module.exports = router;