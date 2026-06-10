const express = require('express');
const router = express.Router();
const { getInvestorsSummary, getInvestorPayouts } = require('../controllers/investorController');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getInvestorsSummary);
router.get('/payouts', protect, getInvestorPayouts);

module.exports = router;
