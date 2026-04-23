const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action_type: { 
    type: String, 
    enum: ['viewed_car', 'booked_test_drive', 'purchased_car'],
    required: true 
  },
  car_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  details: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
