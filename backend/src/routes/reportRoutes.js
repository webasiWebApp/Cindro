const express = require('express');
const router = express.Router();
const { getReports, generatePdf, getPreview } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getReports);
router.post('/deal/:id/pdf', protect, generatePdf);
router.get('/deal/:id/preview', protect, getPreview);

module.exports = router;
