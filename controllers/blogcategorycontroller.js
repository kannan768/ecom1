const BlogCategory = require('../models/blogcategorymodel'); // Adjust the path accordingly

// Create a new blog category
exports.createBlogCategory = async (req, res) => {
    try {
        const blogCategory = new BlogCategory(req.body);
        await blogCategory.save();
        res.status(201).json({ message: 'Blog category created successfully', blogCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a blog category by ID
exports.getBlogCategoryById = async (req, res) => {
    try {
        const blogCategory = await BlogCategory.findById(req.params.id);
        if (!blogCategory) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json({ message: 'Blog category retrieved successfully', blogCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a blog category by ID
exports.updateBlogCategory = async (req, res) => {
    try {
        const blogCategory = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!blogCategory) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json({ message: 'Blog category updated successfully', blogCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a blog category by ID
exports.deleteBlogCategory = async (req, res) => {
    try {
        const blogCategory = await BlogCategory.findByIdAndDelete(req.params.id);
        if (!blogCategory) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json({ message: 'Blog category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBlogCategories = async (req, res) => {
    try {
        const blogCategories = await BlogCategory.find();
        res.status(200).json({ message: 'Blog categories retrieved successfully', blogCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
