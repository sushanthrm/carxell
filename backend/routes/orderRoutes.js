const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrders } = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, restrictTo('customer'), createOrder)
  .get(protect, restrictTo('admin', 'salesperson'), getOrders);

router.get('/my', protect, restrictTo('customer'), getMyOrders);

module.exports = router;
