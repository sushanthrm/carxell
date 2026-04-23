const Service = require('../models/Service');
const Event = require('../models/Event');

exports.bookService = async (req, res) => {
    try {
        const newService = new Service({
            customer_id: req.user ? req.user.id : null,
            ...req.body
        });
        await newService.save();

        if (req.user) {
            await Event.create({
                user_id: req.user.id,
                action: 'booked_service'
            });
        }

        res.status(201).json({ message: 'Service booked successfully!', service: newService });
    } catch (error) {
        res.status(500).json({ message: 'Failed to book service', error: error.message });
    }
};

exports.getServices = async (req, res) => {
    try {
        const filter = req.user.role === 'customer' ? { customer_id: req.user.id } : {};
        const services = await Service.find(filter).populate('customer_id', 'name email');
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch services', error: error.message });
    }
};
