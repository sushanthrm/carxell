const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create a test drive booking
// @route   POST /api/bookings
// @access  Customer
const createBooking = async (req, res) => {
  try {
    const { car_id, date, time } = req.body;
    
    // Prevent double booking
    const existing = await Booking.findOne({ date, time, car_id, status: { $ne: 'cancelled' } });
    if (existing) {
      return res.status(400).json({ message: 'Slot already booked for this car' });
    }

    const booking = new Booking({
      customer_id: req.user.id,
      car_id,
      date,
      time
    });
    
    await booking.save();
    
    // Record event
    await Event.create({
      user_id: req.user.id,
      action_type: 'booked_test_drive',
      car_id
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Customer
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.user.id }).populate('car_id', 'name brand category');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Salesperson/Admin view)
// @route   GET /api/bookings
// @access  Salesperson, Admin
const getBookings = async (req, res) => {
  try {
    // If salesperson, maybe show all pending/assigned to them. Here just returning all for simplicity
    const bookings = await Booking.find()
      .populate('car_id', 'name brand category')
      .populate('customer_id', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Salesperson, Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    if (status) booking.status = status;
    // Assign to salesperson if not already assigned and being accepted
    if (!booking.salesperson_id && req.user.role === 'salesperson') {
       booking.salesperson_id = req.user.id;
    }
    
    await booking.save();

    // Log the event in the events collection
    if (status === 'completed' || status === 'cancelled') {
        await Event.create({
            user_id: req.user.id,
            action_type: status === 'completed' ? 'completed_test_drive' : 'cancelled_test_drive',
            car_id: booking.car_id,
            details: { booking_id: booking._id }
        });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getBookings, updateBookingStatus };
