const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessoryController');

router.get('/', accessoryController.getAccessories);
router.get('/:id', accessoryController.getAccessoryById);
router.post('/', accessoryController.createAccessory);

module.exports = router;
