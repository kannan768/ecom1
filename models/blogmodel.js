const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0
  },
  dislikes: {
      type: Number,
      default: 0
  },
  likedBy: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      }
  ],
  dislikedBy: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      }
  ],author: {
      type: String,
      default: "Admin",
    },
    images: [],
  },
  {
    
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Blog", blogSchema);

