const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const { addFavouriteAritsts , getMyFavouriteArtists , updateFavouriteArtists } = require('../controllers/favouriteAritstController');

router.route('/')
    .post(protect , addFavouriteAritsts)
    .get(protect , getMyFavouriteArtists );

router.route('/:id')
    .put(protect , updateFavouriteArtists)

module.exports = router;