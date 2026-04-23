const Car = require('../models/Car');

// @desc    Fetch all cars with pagination and filter
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    // Build filter
    const query = {};
    if (req.query.brand) query.brand = new RegExp(req.query.brand, 'i');
    if (req.query.category) query.category = new RegExp(req.query.category, 'i');
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const count = await Car.countDocuments(query);
    const cars = await Car.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ cars, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a car
// @route   POST /api/cars
// @access  Admin
const createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      Object.assign(car, req.body);
      const updatedCar = await car.save();
      res.json(updatedCar);
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car) {
      await car.deleteOne();
      res.json({ message: 'Car removed' });
    } else {
      res.status(404).json({ message: 'Car not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock cars
// @route   GET /api/cars/insights/low-stock
// @access  Admin, Salesperson
const getLowStockCars = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 3;
    const cars = await Car.find({ stock: { $lte: threshold } });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getLowStockCars };
