const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  salesperson_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned later or on creation
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

// Prevent double booking for same slot for a test drive at the showroom (we rely on logic in controllers but unique index helps)
bookingSchema.index({ date: 1, time: 1, car_id: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
