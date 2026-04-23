const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carxell_db';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection failed:', error.message));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/authRoutes')); // Map /api/users mapping to auth for admin salesperson creation
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/accessories', require('./routes/accessoryRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

app.get('/', (req, res) => res.send('Carxell Web Application API Running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
