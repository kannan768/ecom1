// Declare the Schema of the Mongo model
const mongoose = require("mongoose");
var orderSchema = new mongoose.Schema(
    {
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          count: Number,
          color: String,
        },
      ],
      paymentIntent: {},
      orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
          "Not Processed",
          "Cash on Delivery",
          "Processing",
          "Dispatched",
          "Cancelled",
          "Delivered",
        ],
      },
      orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      coupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupon",
      },
      totalAfterDiscount: {
        type: Number,
      },Deliverycharge:{
        type:Number,
        default:60
     },
     discountPercentage:{
      type:Number,
     }
    },
    {
      timestamps: true,
    }
  );
  
  //Export the model
  module.exports = mongoose.model("order", orderSchema);