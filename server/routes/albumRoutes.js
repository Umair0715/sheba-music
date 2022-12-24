const router = require('express').Router();
const albumController = require('../controllers/albumController');
const { protect } = require('../middlewares/protect');

router.route('/')
    .post( protect , albumController.createAlbum)
    .get( protect , albumController.getMyAlbums);

router.get('/list' , albumController.getAllAlbums);

router.route('/:id')
    .put(protect , albumController.updateAlbum)
    .delete(protect , albumController.deleteAlbum)
    .get(albumController.getSingleAlbum);

router.delete('/:albumId/delete-item/:itemId' , protect , albumController.deleteAlbumItem);

router.put('/change-image/:id' , protect , albumController.changeAlbumImage);
router.put('/add-item/:id' , protect , albumController.addItemsInAlbum);

router.get('/get-album-songs-and-beats/:albumId' , albumController.getAlbumSongsAndBeats);

router.get('/get-album-songs/:albumId' , albumController.getAlbumSongs);
router.get('/get-album-beats/:albumId' , albumController.getAlbumBeats);

router.delete('/delete/all-albums' , albumController.deleteAllAlbums)

module.exports = router;