const express = require('express');
const router = express.Router();
const { getDeals, getDealById, createDeal, updateDeal, deleteDeal, getDashboardSummary } = require('../controllers/dealController');
const { protect } = require('../middleware/auth');

router.get('/summary/dashboard', protect, getDashboardSummary);
router.route('/')
  .get(protect, getDeals)
  .post(protect, createDeal);

router.route('/:id')
  .get(protect, getDealById)
  .put(protect, updateDeal)
  .delete(protect, deleteDeal);

module.exports = router;
