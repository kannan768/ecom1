const Brand = require('../models/brandmodel');

// Create a new brand
exports.createBrand = async (req, res) => {
    try {
        const brand = new Brand(req.body);
        await brand.save();
        res.status(201).json({ message: 'Brand created successfully', brand });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({ message: 'Brands retrieved successfully', brands });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a brand by ID
exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand retrieved successfully', brand });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a brand by ID
exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand updated successfully', brand });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a brand by ID
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
