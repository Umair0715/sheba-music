const router = require('express').Router();
const commissionController = require('../../controllers/admin/commissionController');
const { protect } = require('../../middlewares/protect');


router.route('/' )
    .post(protect , commissionController.createCommission )
    .get(protect , commissionController.getCommissionList);

router.route('/:id')
    .put(protect , commissionController.updateCommission);

module.exports = router;