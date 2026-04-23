const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const User = require('../models/User');
const Car = require('../models/Car');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');

exports.getSalesDashboard = async (req, res) => {
  try {
    const { role, jurisdiction, id } = req.user; // To be set by auth middleware

    let salesData = [];
    if (role === 'zonal_manager') {
      const view = mongoose.connection.db.collection('regional_sales_view');
      salesData = await view.find({ _id: jurisdiction }).toArray();
    } else if (role === 'state_manager') {
      const view = mongoose.connection.db.collection('state_sales_view');
      salesData = await view.find({ _id: jurisdiction }).toArray();
    } else if (role === 'district_manager') {
      salesData = await Sale.aggregate([
        { $match: { showroom_id: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: "$showroom_id", totalAmount: { $sum: "$amount" }, totalUnits: { $sum: 1 } } }
      ]);
    } else if (role === 'manufacturer') {
      const view = mongoose.connection.db.collection('regional_sales_view');
      salesData = await view.find({}).toArray();
    }
    
    // Detailed monthly aggregation for charts
    let matchStage = {};
    if (role === 'zonal_manager') matchStage.region = jurisdiction;
    if (role === 'state_manager') matchStage.state = jurisdiction;
    if (role === 'district_manager') matchStage.showroom_id = new mongoose.Types.ObjectId(id);

    const monthlySales = await Sale.aggregate([
      { $match: matchStage },
      { $group: { 
          _id: { $month: "$sale_date" },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } }
    ]);

    // Segment donut chart aggregation
    const segmentSales = await Sale.aggregate([
      { $match: matchStage },
      { $lookup: { from: 'cars', localField: 'car_id', foreignField: '_id', as: 'car' } },
      { $unwind: "$car" },
      { $group: { _id: "$car.segment", count: { $sum: 1 } } }
    ]);

    res.json({ salesSummary: salesData, monthlySales, segmentSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCRMData = async (req, res) => {
  // Uses the customer_activity_view for base, then graph lookup for hierarchy if needed
  try {
    const view = mongoose.connection.db.collection('customer_activity_view');
    const activities = await view.find({}).sort({ recentActivity: -1 }).toArray();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
