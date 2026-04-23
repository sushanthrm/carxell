const express = require('express');
const customerController = require('../controllers/customerController');
const { requireAuth } = require('../middleware/auth');

const r = express.Router();

// Public route to view cars
r.get('/cars', customerController.getCars);

// Protected routes (requireAuth middleware required)
r.post('/activity', requireAuth, customerController.logActivity);
r.get('/promotions', requireAuth, customerController.getPromotions);

module.exports = r;
