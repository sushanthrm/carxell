const mongoose = require('mongoose');

const AccessorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { 
        type: String, 
        enum: ['interior', 'exterior', 'spare_parts', 'merchandise'], 
        required: true,
        index: true
    },
    price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
    image_url: { type: String, trim: true },
    car_compatibility: [{ type: String }], // Array of compatible car brands/models. Empty = universal.
    stock: { type: Number, default: 0, min: [0, 'Stock cannot be negative'] }
}, { timestamps: true });

module.exports = mongoose.model('Accessory', AccessorySchema);
