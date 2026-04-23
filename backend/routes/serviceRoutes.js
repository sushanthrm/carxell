const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, serviceController.bookService);
router.get('/', protect, serviceController.getServices);
router.put('/:id', protect, restrictTo('admin', 'salesperson'), serviceController.updateServiceStatus);

module.exports = router;
