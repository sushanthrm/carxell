const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, restrictTo('customer'), createBooking)
  .get(protect, restrictTo('admin', 'salesperson'), getBookings);

router.get('/my', protect, restrictTo('customer'), getMyBookings);
router.put('/:id', protect, restrictTo('admin', 'salesperson'), updateBookingStatus);

module.exports = router;
