const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productschema = new mongoose.Schema(
  {
    productid:{
        type:Number,
        required:true,
        unique:true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      //unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type:String,
      required:true 
    },
    quantity: {type:Number,
    required:true},
    images: {
      type: Array,
    },
    color: {
      type: String,
      required:true
    },
    ratings: [
      {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    brand: {
      type: String,
     required:true
    },
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("product", productschema);
