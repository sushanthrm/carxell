const Accessory = require('../models/Accessory');

// Get all accessories
exports.getAccessories = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'all') query.category = category;
        
        const accessories = await Accessory.find(query);
        res.status(200).json(accessories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accessories', error });
    }
};

// Create accessory (Admin)
exports.createAccessory = async (req, res) => {
    try {
        const accessory = new Accessory(req.body);
        await accessory.save();
        res.status(201).json(accessory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating accessory', error });
    }
};

// Get single accessory by ID
exports.getAccessoryById = async (req, res) => {
    try {
        const accessory = await Accessory.findById(req.params.id);
        if (!accessory) {
            return res.status(404).json({ message: 'Accessory not found' });
        }
        res.status(200).json(accessory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accessory', error });
    }
};

// Update accessory (Admin)
exports.updateAccessory = async (req, res) => {
    try {
        const accessory = await Accessory.findById(req.params.id);
        if (accessory) {
            Object.assign(accessory, req.body);
            const updatedAccessory = await accessory.save();
            res.json(updatedAccessory);
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating accessory', error });
    }
};

// Delete accessory (Admin)
exports.deleteAccessory = async (req, res) => {
    try {
        const accessory = await Accessory.findById(req.params.id);
        if (accessory) {
            await accessory.deleteOne();
            res.json({ message: 'Accessory removed' });
        } else {
            res.status(404).json({ message: 'Accessory not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting accessory', error });
    }
};
