const mongoose = require('mongoose');
const Car = require('./Car');

const orderSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  payment_status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
}, { timestamps: true });

// Compound index for optimizing Dashboard queries
orderSchema.index({ customer_id: 1, payment_status: 1 });

// Referential Integrity check (Simulating SQL Foreign Key constraints)
orderSchema.pre('save', async function() {
  const car = await Car.findById(this.car_id);
  if (!car) {
    throw new Error('Referential Integrity Error: Car does not exist in the database');
  }
});

module.exports = mongoose.model('Order', orderSchema);
