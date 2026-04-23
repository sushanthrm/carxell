const Car = require('../models/Car');
const Inventory = require('../models/Inventory');
const ActivityLog = require('../models/ActivityLog');
const Promotion = require('../models/Promotion');

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const { type, car_id } = req.body;
    await ActivityLog.create({
      customer_id: req.user.id,
      type,
      car_id
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPromotions = async (req, res) => {
  try {
    const promos = await Promotion.find({ customer_id: req.user.id }).populate('car_id');
    res.json(promos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
