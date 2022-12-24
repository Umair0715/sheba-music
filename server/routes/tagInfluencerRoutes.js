const router = require('express').Router();
const { 
    createInfluencerTag , 
    getMyInfluencers , 
    updateInfluencer , 
    deleteInfluencer ,
    getSingleUserInfluencers
} = require('../controllers/tagInfluencerController');
const { protect } = require('../middlewares/protect');


router.route('/')
    .post(protect , createInfluencerTag)
    .get(protect , getMyInfluencers )
router.route('/:influencerId')
    .put(protect , updateInfluencer)
    .delete(protect , deleteInfluencer);
router.get('/user/:userId' , protect , getSingleUserInfluencers );

module.exports = router;