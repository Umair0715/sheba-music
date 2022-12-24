const router = require('express').Router();
const bannerController = require('../../controllers/admin/bannerController');
const { protect } = require('../../middlewares/protect');

router.route('/')
    .post(bannerController.createBanner)
    .get(bannerController.getBanner);

router.delete('/delete-image/:id' , bannerController.deleteBannerImage);

router.route('/:id')
    .put(bannerController.updateBanner)
    .delete(bannerController.deleteBanner);
    

module.exports = router;