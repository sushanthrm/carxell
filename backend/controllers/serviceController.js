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
                action_type: 'booked_service'
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

exports.updateServiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const service = await Service.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!service) return res.status(404).json({ message: 'Service not found' });

        // Log the event in the events collection
        if (status === 'completed' || status === 'cancelled') {
            await Event.create({
                user_id: req.user.id,
                action_type: status === 'completed' ? 'completed_service' : 'cancelled_service',
                details: { service_id: service._id, req_service: service.req_service }
            });
        }

        res.status(200).json({ message: 'Service status updated', service });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update service status', error: error.message });
    }
};
