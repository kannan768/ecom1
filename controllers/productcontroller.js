const Product = require("../models/productmodel");
const slugify = require('slugify');
const users=require('../models/usermodel')
const fs = require('fs'); // For file system operations (e.g., deleting files)

exports.uploadProductImages = async (req, res) => {
  try {
    const { productid } = req.params;

    // Check if the product exists
    const productExist = await Product.findById(productid);
    if (!productExist) {
      return res.status(400).json({ message: "Product not found" });
    }

    // Handle file upload using Multer
    const imageUrls = req.files.map(file => file.path); // Assuming 'path' is correct for Multer

    // Update product with new images
    productExist.images = productExist.images.concat(imageUrls);
    await productExist.save();

    // Delete uploaded files from server after saving to MongoDB
    imageUrls.forEach(file => fs.unlinkSync(file)); // Delete each file synchronously

    res.status(200).json({ message: "Images uploaded successfully", images: productExist.images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Generate slug from title
    console.log(req.body)
    req.body.slug = slugify(req.body.title, { lower: true });

    // Create new product
    const originalPrice = req.body.price;
    const discount = req.body.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * (discount / 100));

    // Create new product
    const product = new Product({
      ...req.body,
      MRP: originalPrice,
      price: discountedPrice
    });

    await product.save();
    res.status(201).json(product);
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
//   exports.getAllProducts = async (req, res) => {
//     try {
//         // Get page and limit from query parameters with default values
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 2;

//         // Calculate the starting index of the items for the current page
//         const startIndex = (page - 1) * limit;

//         // Find products, sorted by latest post, with pagination and field limiting
//         const products = await Product.find()
//             .sort({ createdAt: -1 })
//             .skip(startIndex)
//             .limit(limit)
//             //.select('name price createdAt'); // Replace with the fields you want to return

//         if (products.length === 0) {
//             return res.status(404).json({ message: "No data found" });
//         }

//         res.status(200).json({
//             products,
//             page,
//             totalPages: Math.ceil(await Product.countDocuments() / limit),
//             totalProducts: await Product.countDocuments(),
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
exports.getAllProducts = async (req, res) => {
  try {
      // Find all products, sorted by latest post
      const products = await Product.find().sort({ createdAt: -1 });

      if (products.length === 0) {
          return res.status(404).json({ message: "No data found" });
      }

      res.status(200).json({ products });
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
  
//   exports.addorremovewhitelist = async (req, res) => {
//     const { productid, userid } = req.params;

//     try {
//         const user = await users.findById(userid);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const products = await Product.findOne({ productid: productid });
//         if (!products) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         const productIndex = user.wishlist.indexOf(productid);
//         if (productIndex > -1) {
//             // Product ID exists in the wishlist, remove it
//             user.wishlist.splice(productIndex, 1);
//             await user.save();
//             return res.status(200).json({ message: 'Product removed from wishlist' });
//         } else {
//             // Product ID does not exist in the wishlist, add it
//             user.wishlist.push(productid);
//             await user.save();
//             return res.status(200).json({ message: 'Product added to wishlist' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
// exports.addorremovewhitelist = async (req, res) => {
//   try {
//     // accessing ids from like route
//     const products = req.params.productid;
//     const usreId = req.params.usreid;

//     // checking id's validitity in the database
//     const postExist = await Product.findById(products);
//     console.log(postExist);
//     const userExist = await users.findById(usreId);

//     if (!postExist) {
//       return res.status(400).json({ message: "product not found" });
//     }

//     if (!userExist) {
//       return res.status(400).json({ message: "User not found" });
//     }

    
//   }
exports.addorremovewhitelist = async (req, res) => {
  try {
      // Accessing ids from the route
      const productid = req.params.productid;
      const userid = req.params.userid;

      // Checking id's validity in the database
      const productExist = await Product.findById(productid);
      console.log(productExist)
      const userExist = await users.findById(userid);

      if (!productExist) {
          return res.status(400).json({ message: "Product not found" });
      }

      if (!userExist) {
          return res.status(400).json({ message: "User not found" });
      }

      // Check if the product is already in the user's wishlist
      const productIndex = userExist.wishlist.indexOf(productExist._id);
      if (productIndex > -1) {
          // Product ID exists in the wishlist, remove it
          userExist.wishlist.splice(productIndex, 1);
          await userExist.save();
          return res.status(200).json({ message: 'Product removed from wishlist' });
      } else {
          // Product ID does not exist in the wishlist, add it
          userExist.wishlist.push(productExist._id);
          await userExist.save();
          return res.status(200).json({ message: 'Product added to wishlist' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
exports.getAllWishlistProducts = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find the user by ID and populate their wishlist with product details
    const user = await users.findById(userid).populate('wishlist');

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { productid, userid } = req.params;
    const { star,comment } = req.body; // Get the rating from the query string

    // Check if the product and user exist
    const productExist = await Product.findById(productid);
    if (!productExist) {
      return res.status(400).json({ message: "Product not found" });
    }

    const userExist = await users.findById(userid);
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user has already rated the product
    const existingRatingIndex = productExist.ratings.findIndex(
      (rating) => rating.postedby.toString() === userid
    );

    if (existingRatingIndex > -1) {
      // User has already rated this product, update the rating
      productExist.ratings[existingRatingIndex].star = star;
      productExist.ratings[existingRatingIndex].comment = comment;
    } else {
      // User has not rated this product, add a new rating
      productExist.ratings.push({
        star: Number(star),
        comment:comment,
        postedby: userid,
      });
    }
    productExist.totalratings = productExist.ratings.length;
    // Save the product with the new or updated rating
    await productExist.save();

    return res.status(200).json({ message: "Rating added/updated successfully", ratings: productExist.ratings,totalratings: productExist.totalratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.body;

    // Find products by brand
    const products = await Product.find({ brand });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found for brand '${brand}'` });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByStarRating = async (req, res) => {
  try {
    const { star } = req.body;

    // Convert star to number
    const starRating = parseInt(star);

    // Find products where at least one rating matches the specified star rating
    const products = await Product.find({ 'ratings.star': starRating });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found with rating ${starRating} stars` });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByDiscountRange = async (req, res) => {
  try {
    const { start, end } = req.params;

    // Convert start and end to numbers
    const startDiscount = parseInt(start);
    const endDiscount = parseInt(end);

    if (isNaN(startDiscount) || isNaN(endDiscount)) {
      return res.status(400).json({ message: 'Invalid discount range' });
    }

    // Find products within the discount range
    const products = await Product.find({
      discount: { $gte: startDiscount, $lt: endDiscount }
    });

    if (products.length === 0) {
      return res.status(404).json({ message: `No products found within discount range ${startDiscount}% to ${endDiscount}%` });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getlatestarrival = async (req, res) => {
  try {
    // Find the last 100 products, sorted by createdAt (newest first)
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(100);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};