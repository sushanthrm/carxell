require('dotenv').config();
const mongoose = require('mongoose');
const Accessory = require('./models/Accessory');

const accessories = [
    { name: 'Premium Leather Seat Covers', category: 'interior', price: 299, stock: 50 },
    { name: 'All-Weather Floor Mats', category: 'interior', price: 120, stock: 200 },
    { name: 'Carbon Fiber Spoiler', category: 'exterior', price: 450, stock: 15 },
    { name: 'LED Headlights Upgrade Kit', category: 'exterior', price: 300, stock: 40 },
    { name: 'High-Performance Brake Pads', category: 'spare_parts', price: 150, stock: 100 },
    { name: 'Carxell Branded Keychain', category: 'merchandise', price: 15, stock: 500 }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carxell_db').then(async () => {
    console.log('Seeding Accessories...');
    await Accessory.deleteMany({});
    await Accessory.insertMany(accessories);
    console.log('Accessories seeded!');
    process.exit(0);
}).catch(console.error);
