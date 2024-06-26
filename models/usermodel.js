const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
   
  },
  email: {
    type: String,
    required: true,
    unique:true
   
  },
  otp: { type: String, required: false },
  mobile: {
    type: String,
    required: true,
   unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  address: {
    type: String,
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  id:{
    type:Date,
    default:Date.now()
  },
  isblocked:{
    type:Boolean,
    default:false
  },
  refreshToken:{
    type:String
  }
 
},
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("User", userSchema);
