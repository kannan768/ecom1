const User = require("../models/usermodel");
const Cart = require("../models/cartmodel");
const Product = require("../models/productmodel");
const Coupon = require("../models/couponmodel");
const Order = require("../models/ordermodel");


exports.createOrder = async (req, res) => {
    try {
      const { userid } = req.params;
      const { cartId, couponName } = req.body;
  
      // Validate the user ID
      const user = await User.findById(userid);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      // Validate the cart ID
      const cart = await Cart.findById(cartId).populate('products.product');
      if (!cart || cart.orderby.toString() !== userid) {
        return res.status(400).json({ message: "Cart not found or does not belong to the user" });
      }
      
  
      // Check if the cart is empty
      if (cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
  
      let discount = 0;
      let totalAfterDiscount = cart.cartTotal;
  
      // Validate and apply the coupon if provided
      if (couponName) {
        const coupon = await Coupon.findOne({ name: couponName.toUpperCase() });
        if (!coupon) {
          return res.status(400).json({ message: "Invalid coupon" });
        }
  
        // Check if the coupon is expired
        if (new Date(coupon.expiry) < new Date()) {
          return res.status(400).json({ message: "Coupon has expired" });
        }
  
        discount = coupon.discount;
        totalAfterDiscount = Math.round((cart.cartTotal - (cart.cartTotal * discount / 100)) * 100) / 100;
      }
  
      // Create the order
      const order = new Order({
        products: cart.products,
        orderby: userid,
        totalAmount: cart.cartTotal,
        coupon: Coupon ? Coupon._id : null,
        totalAfterDiscount,
        orderStatus: "Not Processed",
        discountPercentage:discount
     
      });
  console.log(order);
      // Save the order
      await order.save();
  
      // Reduce the product quantities
      for (let i = 0; i < cart.products.length; i++) {
        const { product, count } = cart.products[i];
        await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -count,sold:count } });
      }
  
      // Clear the cart
      cart.products = [];
      cart.cartTotal = 0;
      cart.totalcount = 0;
      await cart.save();
  
      res.status(200).json({ message: "Order created successfully", order, discountPercentage: `${discount}%` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  exports.getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
  
      // Fetch the order by ID
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDirectOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, color, couponName } = req.body;

    // Validate the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate the product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    // Check if the specified color is available for the product
    if (!product.color.includes(color)) {
      return res.status(400).json({ message: `Color '${color}' is not available for this product` });
    }

    // Check product availability
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }

    const deliveryCharge = 60;
    let totalAmount = product.price * quantity;
    let totalAmountWithDelivery = totalAmount + deliveryCharge;
    let totalAfterDiscount = totalAmountWithDelivery;
    let discountPercentage = 0;
    // Validate and apply the coupon if provided
    if (couponName) {
      const coupon = await Coupon.findOne({ name: couponName.toUpperCase() });
      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      // Check if the coupon is expired
      if (new Date(coupon.expiry) < new Date()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }

      discountPercentage = coupon.discount;
      totalAfterDiscount = Math.round((totalAmountWithDelivery - (totalAmountWithDelivery * discountPercentage / 100)) * 100) / 100;
      }

    // Create the order
    const order = new Order({
      products: [{
        product: product._id,
        count: quantity,
        color: color,
      }],
      orderby: userId,
      totalAmount: totalAmount,
      coupon: Coupon ? Coupon._id : null,
      totalAfterDiscount,
     deliveryCharge: deliveryCharge,
     discountPercentage: discountPercentage,
      orderStatus: "Not Processed",
     
    });

    console.log(order);

    // Save the order
    await order.save();

    // Reduce the product quantities
    await Product.findByIdAndUpdate(product._id, { $inc: { quantity: -quantity, sold: quantity } });

//     res.status(200).json({ message: "Order created successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
res.status(200).json({ 
  message: "Order created successfully", 
  order: {
    ...order.toObject(),
    deliveryCharge: `${deliveryCharge}%`, discountPercentage: `${discountPercentage}%`, 
  }
});
} catch (error) {
res.status(500).json({ error: error.message });
}
};
