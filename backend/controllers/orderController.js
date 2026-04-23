const Order = require('../models/Order');
const Car = require('../models/Car');
const Event = require('../models/Event');

// @desc    Simulate payment and create order
// @route   POST /api/orders
// @access  Customer
const createOrder = async (req, res) => {
  try {
    const { car_id } = req.body;
    
    const car = await Car.findById(car_id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    
    if (car.stock <= 0) return res.status(400).json({ message: 'Car is out of stock' });

    // Simulate payment logic here... assuming successful
    const order = new Order({
      customer_id: req.user.id,
      car_id,
      price: car.price,
      payment_status: 'paid'
    });
    
    await order.save();
    
    // Reduce stock
    car.stock -= 1;
    await car.save();
    
    // Record event
    await Event.create({
      user_id: req.user.id,
      action_type: 'purchased_car',
      car_id
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: req.user.id }).populate('car_id', 'name brand');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin, Salesperson
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('car_id', 'name brand')
      .populate('customer_id', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrders };
