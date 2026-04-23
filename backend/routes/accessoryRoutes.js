const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
  .get(accessoryController.getAccessories)
  .post(protect, restrictTo('admin'), accessoryController.createAccessory);

router.route('/:id')
  .get(accessoryController.getAccessoryById)
  .put(protect, restrictTo('admin'), accessoryController.updateAccessory)
  .delete(protect, restrictTo('admin'), accessoryController.deleteAccessory);

module.exports = router;
