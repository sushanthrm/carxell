const express = require('express');
const router = express.Router();
const { register, login, createSalesperson } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/create-salesperson', protect, restrictTo('admin'), createSalesperson);

module.exports = router;
