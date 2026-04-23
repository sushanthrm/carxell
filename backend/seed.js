const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');
const Order = require('./models/Order');
const Event = require('./models/Event');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carxell_db';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB. Wiping existing data...');

    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    await Order.deleteMany();
    await Event.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // Users
    const admin = await User.create({ name: 'Admin', email: 'admin@carxell.com', password, role: 'admin' });
    const sales = await User.create({ name: 'Bob Sales', email: 'sales@carxell.com', password, role: 'salesperson' });
    const cust1 = await User.create({ name: 'John Doe', email: 'john@user.com', password, role: 'customer' });
    const cust2 = await User.create({ name: 'Jane Smith', email: 'jane@user.com', password, role: 'customer' });

    console.log('Users created');

    // Cars
    const car1 = await Car.create({ name: 'Model S', brand: 'Tesla', category: 'Sedan', price: 80000, stock: 5, specs: { engine: 'Electric dual motor', range_or_mileage: '400 miles', transmission: 'Automatic' }});
    const car2 = await Car.create({ name: 'Raptor', brand: 'Ford', category: 'Truck', price: 65000, stock: 2, specs: { engine: 'V6 Twin Turbo', range_or_mileage: '15 mpg', transmission: '10-speed Automatic' }});
    const car3 = await Car.create({ name: 'Civic Type R', brand: 'Honda', category: 'Hatchback', price: 44000, stock: 1, specs: { engine: '2.0L Turbo', range_or_mileage: '25 mpg', transmission: '6-speed Manual' }});
    const car4 = await Car.create({ name: 'X5', brand: 'BMW', category: 'SUV', price: 70000, stock: 8, specs: { engine: '3.0L Inline 6', range_or_mileage: '22 mpg', transmission: '8-speed Automatic' }});
    
    console.log('Cars created');

    // Sample events (view, book)
    await Event.create({ user_id: cust1._id, action_type: 'viewed_car', car_id: car1._id });
    await Event.create({ user_id: cust1._id, action_type: 'viewed_car', car_id: car1._id }); // High intent -> 2 views
    await Event.create({ user_id: cust1._id, action_type: 'booked_test_drive', car_id: car1._id });
    
    await Event.create({ user_id: cust2._id, action_type: 'viewed_car', car_id: car4._id });

    // Orders
    await Order.create({ customer_id: cust2._id, car_id: car2._id, price: car2.price, payment_status: 'paid' });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
