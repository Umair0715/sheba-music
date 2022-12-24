const router = require('express').Router();
const { getMyDownloadBeats , addToBeatDownloads , deleteBeatFromDownloads } = require('../controllers/downloadBeatsController');
const { protect } = require('../middlewares/protect');

router.route('/')
    .post(protect , addToBeatDownloads)
    .get(protect , getMyDownloadBeats)

router.delete('/:downloadId' , protect , deleteBeatFromDownloads);

module.exports = router;