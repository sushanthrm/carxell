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

    // 5. High-Intent User Detection (Users with multiple views + test drive booking)
    const highIntentUsers = await Event.aggregate([
      { 
        $group: { 
          _id: "$user_id", 
          views: { $sum: { $cond: [{ $eq: ["$action_type", "viewed_car"] }, 1, 0] } },
          test_drives: { $sum: { $cond: [{ $eq: ["$action_type", "booked_test_drive"] }, 1, 0] } }
        }
      },
      { $match: { views: { $gte: 2 }, test_drives: { $gte: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: "$user" },
      { $project: { _id: 1, views: 1, test_drives: 1, name: "$user.name", email: "$user.email" } }
    ]);

    res.json({
      salesSummary: salesStats.length > 0 ? salesStats[0] : { totalSales: 0, totalRevenue: 0 },
      revenueOverTime: revenueOverTime.map(item => ({ date: `${item._id.month}/${item._id.year}`, revenue: item.revenue })),
      topCars,
      popularCategories,
      highIntentUsers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
