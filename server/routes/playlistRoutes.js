const router = require('express').Router();
const playlistController = require('../controllers/playlistController');
const { protect } = require('../middlewares/protect');

router.route('/')
    .post( protect , playlistController.createPlaylist)
    .get( protect , playlistController.getMyPlaylists);

router.get('/list' , playlistController.getAllPlaylists );

router.route('/:id')
    .put(protect , playlistController.updatePlaylist)
    .delete(protect , playlistController.deletePlaylist)
    .get(playlistController.getSinglePlaylist);

router.put('/change-image/:id' , protect , playlistController.changePlaylistImage)

router.put('/addSongs/:id' , protect , playlistController.addSongsInPlaylist);

module.exports = router;