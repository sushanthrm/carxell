const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true }, // SUV, Sedan, etc.
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  stock: { type: Number, required: true, default: 0, min: [0, 'Stock cannot be negative'] },
  image_url: { type: String, trim: true },
  specs: {
    engine: String,
    range_or_mileage: String,
    transmission: String
  }
}, { timestamps: true });

// Compound index for filtering
carSchema.index({ brand: 1, category: 1 });
// Text index for search
carSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('Car', carSchema);
