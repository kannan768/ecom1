const Product = require("../models/productmodel");
const slugify = require('slugify');

// Controller for creating a new product
exports.createProduct = async (req, res) => {
  try {
    // Generate slug from title
    console.log(req.body)
    req.body.slug = slugify(req.body.title, { lower: true });

    // Create new product
    const product = new Product(req.body);

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
/* exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });;
      if (products.length === 0) {
        return res.status(404).json({ message: "No data found" });
      }
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; */
  exports.getAllProducts = async (req, res) => {
    try {
        // Get page and limit from query parameters with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;

        // Calculate the starting index of the items for the current page
        const startIndex = (page - 1) * limit;

        // Find products, sorted by latest post, with pagination and field limiting
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit)
            //.select('name price createdAt'); // Replace with the fields you want to return

        if (products.length === 0) {
            return res.status(404).json({ message: "No data found" });
        }

        res.status(200).json({
            products,
            page,
            totalPages: Math.ceil(await Product.countDocuments() / limit),
            totalProducts: await Product.countDocuments(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 

  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.updateProductById = async (req, res) => {
    const { id } = req.params; // Extract id from URL params
    const updates = req.body; // Extract updates from request body
  console.log(id);
    try {
      // Check if the product exists
      const product = await Product.findById(id);
      console.log(product)
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // If the title is being updated, generate a new slug
      if (updates.title) {
        updates.slug = slugify(updates.title, { lower: true });
      }
  
      // Update the product with the provided updates
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
  
      res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteProductById = async (req, res) => {
    const { id } = req.params; // Extract id from URL params
  
    try {
      // Check if the product exists
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Delete the product
      await Product.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  