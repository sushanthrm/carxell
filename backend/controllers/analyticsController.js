const Order = require('../models/Order');
const Event = require('../models/Event');
const Car = require('../models/Car');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    // 1. Total Sales and Revenue
    const salesStats = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, totalSales: { $sum: 1 }, totalRevenue: { $sum: '$price' } } }
    ]);

    // 1b. Year-To-Date (YTD) Revenue
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const ytdStats = await Order.aggregate([
      { $match: { payment_status: 'paid', createdAt: { $gte: startOfYear } } },
      { $group: { _id: null, ytdRevenue: { $sum: '$price' } } }
    ]);

    // 2. Revenue Over Time (Gruoped by Month for simplicity - Assuming timestamps)
    const revenueOverTime = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { 
        $group: { 
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          }, 
          revenue: { $sum: '$price' } 
        } 
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 3. Most Popular Cars (Best Sellers)
    const topCars = await Order.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: "$car_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'cars', localField: '_id', foreignField: '_id', as: 'carDetails' } },
      { $unwind: "$carDetails" },
      { $project: { _id: 1, count: 1, name: "$carDetails.name", brand: "$carDetails.brand" } }
    ]);

    // 4. Recommendation System data (Most viewed categories)
    const popularCategories = await Event.aggregate([
      { $match: { action_type: 'viewed_car' } },
      { $lookup: { from: 'cars', localField: 'car_id', foreignField: '_id', as: 'carDetails' } },
      { $unwind: "$carDetails" },
      { $group: { _id: "$carDetails.category", views: { $sum: 1 } } },
      { $sort: { views: -1 } }
    ]);

    // 5. Hot Deals (Customers with test drives AFTER their most recent purchase)
    const hotDeals = await Event.aggregate([
      {
        $group: {
          _id: "$user_id",
          test_drives: { $sum: { $cond: [{ $eq: ["$action_type", "booked_test_drive"] }, 1, 0] } },
          last_test_drive: { $max: { $cond: [{ $eq: ["$action_type", "booked_test_drive"] }, "$createdAt", null] } },
          last_purchase: { $max: { $cond: [{ $eq: ["$action_type", "purchased_car"] }, "$createdAt", null] } }
        }
      },
      { 
        $match: { 
          test_drives: { $gt: 0 }, 
          $expr: {
            $or: [
              { $eq: ["$last_purchase", null] },
              { $gt: ["$last_test_drive", "$last_purchase"] }
            ]
          }
        } 
      },
      { $sort: { test_drives: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: "$user" },
      { $project: { _id: 1, test_drives: 1, name: "$user.name", email: "$user.email", mobile_no: "$user.mobile_no" } }
    ]);

    res.json({
      salesSummary: {
        totalSales: salesStats.length > 0 ? salesStats[0].totalSales : 0,
        totalRevenue: salesStats.length > 0 ? salesStats[0].totalRevenue : 0,
        ytdRevenue: ytdStats.length > 0 ? ytdStats[0].ytdRevenue : 0
      },
      revenueOverTime: revenueOverTime.map(item => ({ date: `${item._id.month}/${item._id.year}`, revenue: item.revenue })),
      topCars,
      popularCategories,
      hotDeals
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
