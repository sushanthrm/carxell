const express = require('express');
const router = express.router;
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

const r = express.Router();

r.get('/sales', requireAuth, dashboardController.getSalesDashboard);
r.get('/crm', requireAuth, dashboardController.getCRMData);

module.exports = r;
