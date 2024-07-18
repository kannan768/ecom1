const ProductCategory = require('../models/productcategorymodel') // Adjust the path accordingly

// Create a new product category
exports.createProductCategory = async (req, res) => {
    try {
        const productCategory = new ProductCategory(req.body);
        await productCategory.save();
        res.status(201).json({ message: 'Product category created successfully', productCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all product categories
exports.getAllProductCategories = async (req, res) => {
    try {
        const productCategories = await ProductCategory.find();
        res.status(200).json({ message: 'Product categories retrieved successfully', productCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a product category by ID
exports.getProductCategoryById = async (req, res) => {
    try {
        const productCategory = await ProductCategory.findById(req.params.id);
        if (!productCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json({ message: 'Product category retrieved successfully', productCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product category by ID
exports.updateProductCategory = async (req, res) => {
    try {
        const productCategory = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!productCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json({ message: 'Product category updated successfully', productCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a product category by ID
exports.deleteProductCategory = async (req, res) => {
    try {
        const productCategory = await ProductCategory.findByIdAndDelete(req.params.id);
        if (!productCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json({ message: 'Product category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
