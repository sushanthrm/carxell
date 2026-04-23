const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, serviceController.bookService);
router.get('/', protect, serviceController.getServices);

module.exports = router;
