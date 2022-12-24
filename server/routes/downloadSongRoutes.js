const router = require('express').Router();
const { getMyDownloadSongs , addToSongsDownloads , deleteSongFromDownloads } = require('../controllers/donwloadSongsController');
const { protect } = require('../middlewares/protect');

router.route('/')
    .post(protect , addToSongsDownloads)
    .get(protect , getMyDownloadSongs)

router.delete('/:downloadId' , protect , deleteSongFromDownloads);

module.exports = router;