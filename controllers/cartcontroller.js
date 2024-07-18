const User = require("../models/usermodel");
const Cart = require('../models/cartmodel'); // Adjust the path as necessary
const Product = require('../models/productmodel'); 
const Coupon = require('../models/couponmodel'); // Adjust the path as necessary

// exports.addToCart = async (req, res) => {

//   try {
//     const { userid } = req.params;
//     const { products } = req.body;

//     // Initialize an array to hold products to be added
//     const productsToAdd = [];

//     // Validate product IDs and fetch product details from the database
//     for (const item of products) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         return res.status(400).json({ message: `Product with ID ${item.product} not found` });
//       }
      
//       // Add product details to the productsToAdd array
//       productsToAdd.push({
//         product: product._id,
//         count: item.count,
//         color: item.color,
//         price: product.price // Use the price from the database
//       });
//     }

//     // Find the user's cart or create a new one if it doesn't exist
//     let cart = await Cart.findOne({ orderby: userid });
//     if (!cart) {
//       cart = new Cart({ orderby: userid, products: [] });
//     }

//     // Add new products to the cart
//     productsToAdd.forEach(item => {
//       const existingProductIndex = cart.products.findIndex(p => p.product.toString() === item.product.toString());
//       if (existingProductIndex > -1) {
//         // Update the existing product count if it already exists in the cart
//         cart.products[existingProductIndex].count += item.count;
//         cart.products[existingProductIndex].color = item.color; // Update color if needed
//       } else {
//         // Add the new product to the cart
//         cart.products.push(item);
//       }
//     });

//     // Calculate the cart total
//     cart.cartTotal = Math.round(cart.products.reduce((acc, item) => acc + (item.price * item.count) + 60, 0) * 100) / 100;
//     cart.totalcount = cart.products.reduce((acc, item) => acc + item.count, 0);
//     // Save the updated cart
//     await cart.save();

//     res.status(200).json({ message: "Products added to cart successfully", cart });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
exports.addToCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { products } = req.body;

    // Validate the user ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Initialize an array to hold products to be added
    const productsToAdd = [];

    // Validate product IDs and fetch product details from the database
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.product} not found` });
      }
      let cart = await Cart.findOne({ orderby: userid });
      if (!cart) {
        cart = new Cart({ orderby: userid, products: [] });
      }

      // Check the current count of the product in the cart
      const existingProductIndex = cart.products.findIndex(p => p.product.toString() === item.product.toString());
      let currentCount = 0;
      if (existingProductIndex > -1) {
        currentCount = cart.products[existingProductIndex].count;
      }

      // Calculate the new total count
      const newCount = currentCount + item.count;

      // Check if the new count exceeds the available quantity
      if (newCount > product.quantity) {
        return res.status(400).json({ message: `Only ${product.quantity} units available, you cannot add more than the available quantity of product ID ${item.product}` });
      }
      if (!product.color.includes(item.color)) {
        return res.status(400).json({ message: `Color '${item.color}' is not available for product ID ${item.product}` });
      }
      // Add product details to the productsToAdd array
      productsToAdd.push({
        product: product._id,
        count: item.count,
        color: item.color,
        price: product.price // Use the price from the database
      });
    }

    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ orderby: userid });
    if (!cart) {
      cart = new Cart({ orderby: userid, products: [] });
    }

    // Add new products to the cart
    productsToAdd.forEach(item => {
      const existingProductIndex = cart.products.findIndex(p => p.product.toString() === item.product.toString());
      if (existingProductIndex > -1) {
        // Update the existing product count if it already exists in the cart
        cart.products[existingProductIndex].count += item.count;
      // Update color if needed
      } else {
        // Add the new product to the cart
        cart.products.push(item);
      }
    });

    // Calculate the cart total and total count
    cart.cartTotal = Math.round(cart.products.reduce((acc, item) => acc + (item.price * item.count) + 60, 0) * 100) / 100;
    cart.totalcount = cart.products.reduce((acc, item) => acc + item.count, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Products added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ orderby: userid }).populate('products.product', 'title price'); // Populate products with selected fields

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getAllCart = async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product', 'title'); // Populate products with selected fields

    res.status(200).json({ message: "Carts retrieved successfully", carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




exports.deleteProductFromCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { productid } = req.body;

    // Validate the user ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ orderby: userid });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart and remove it
    const productIndex = cart.products.findIndex(p => p.product.toString() === productid);
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      // Recalculate the cart total and total count
      cart.cartTotal = Math.round(cart.products.reduce((acc, item) => acc + (item.price * item.count) + 60, 0) * 100) / 100;
      cart.totalcount = cart.products.reduce((acc, item) => acc + item.count, 0);

      // Save the updated cart
      await cart.save();

      return res.status(200).json({ message: "Product removed from cart successfully", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { userid } = req.params;
    const { productid, count, color } = req.body;

    // Validate the user ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ orderby: userid });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(p => p.product.toString() === productid);
    if (productIndex > -1) {
      // Update the product's count and color
      if (count !== undefined) cart.products[productIndex].count = count;
      if (color !== undefined) cart.products[productIndex].color = color;

      // Recalculate the cart total and total count
      cart.cartTotal = Math.round(cart.products.reduce((acc, item) => acc + (item.price * item.count) + 60, 0) * 100) / 100;
      cart.totalcount = cart.products.reduce((acc, item) => acc + item.count, 0);

      // Save the updated cart
      await cart.save();

      return res.status(200).json({ message: "Cart updated successfully", cart });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { userid } = req.params;
    const { couponName } = req.body;

    // Validate the user ID
    const user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate the coupon
    const coupon = await Coupon.findOne({ name: couponName.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    // Check if the coupon is expired
    if (new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ orderby: userid });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate the discount
    const discount = coupon.discount;
    const totalAfterDiscount = Math.round((cart.cartTotal - (cart.cartTotal * discount / 100)) * 100) / 100;

    // Update the cart with the discount
    cart.totalAfterDiscount = totalAfterDiscount;
    
    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Coupon applied successfully", discountPercentage: discount+"%", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
