const router = require('express').Router();
const { protect } = require('../middlewares/protect');
const buyTicketController = require('../controllers/buyTicketController');

router.route('/')
    .post(protect , buyTicketController.buyTicket);

module.exports = router;