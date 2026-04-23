const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar, getLowStockCars } = require('../controllers/carController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/insights/low-stock', protect, restrictTo('admin', 'salesperson'), getLowStockCars);
router.route('/').get(getCars).post(protect, restrictTo('admin'), createCar);
router.route('/:id').get(getCarById).put(protect, restrictTo('admin'), updateCar).delete(protect, restrictTo('admin'), deleteCar);

module.exports = router;
