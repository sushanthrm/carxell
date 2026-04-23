const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest booking is allowed
    mobile_no: { type: String, required: true },
    email: { type: String, required: true },
    car_model: { type: String, required: true },
    req_service: { type: String, required: true }, // e.g. "General Servicing", "Oil Change"
    pick_drop: { type: Boolean, default: false },
    date: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
