const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', protect, restrictTo('admin', 'salesperson'), getAnalytics);

module.exports = router;
