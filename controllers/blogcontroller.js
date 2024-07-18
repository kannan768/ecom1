const blogs = require('../models/blogmodel');
const users = require("../models/usermodel");
const fs = require('fs'); // For file system operations (e.g., deleting files)

exports.uploadblogImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the product exists
    const blogExist = await blogs.findById(id);
    if (!blogExist) {
      return res.status(400).json({ message: "blog not found" });
    }

    // Handle file upload using Multer
    const imageUrls = req.files.map(file => file.path); // Assuming 'path' is correct for Multer

    // Update product with new images
    blogExist.images = blogExist.images.concat(imageUrls);
    await blogExist.save();

    // Delete uploaded files from server after saving to MongoDB
    imageUrls.forEach(file => fs.unlinkSync(file)); // Delete each file synchronously

    res.status(200).json({ message: "Images uploaded successfully", images: blogExist.images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    console.log(req.body);
    const newBlog = new blogs(req.body);
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAllBlogs = async (req, res) => {
  try {
    const blog = await blogs.find();
    res.json(blog);
    console.log(blog)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogs.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment numViews by 1
    blog.numViews += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const updatedBlog = await blogs.findByIdAndUpdate(blogId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to delete a blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const deletedBlog = await blogs.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.likeblog = async (req, res) => {
//   const { id } = req.params.id;
//  console.log(id)
//   try {
//     const user = await blogs.findOne({ id });
//     if (!user) {
//       return res.status(404).json({ message: "id not found" });
//     }

//     user.isLiked = !user.isLiked;
//     await user.save();

//     res.status(200).json({ message: `blog isblocked status to ${user.isLiked}` });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.likeblog = async (req, res) => {
  try {
    // accessing ids from like route
    const blogId = req.params.blogid;
    const usreId = req.params.usreid;

    // checking id's validitity in the database
    const postExist = await blogs.findById(blogId);
    console.log(postExist);
    const userExist = await users.findById(usreId);

    if (!postExist) {
      return res.status(400).json({ message: "blog not found" });
    }

    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    // checking if user already liked the post in the past
    if (postExist.likedBy.includes(usreId)) {
      return res.status(400).json({ message: "Post already liked" });
    }

    // checking if user already disliked then remove dislike
    if (postExist.dislikedBy.includes(usreId)) {
      postExist.dislikedBy.pull(usreId);
      postExist.dislikes -= 1;
    }

    // creating like and storing into the database
    postExist.likedBy.push(usreId);
    postExist.likes += 1;

    const savedLikes = await postExist.save();
    res.status(200).json(savedLikes);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.dislike = async (req, res) => {
  try {
    // accessing ids from like route
    const blogId = req.params.blogid;
    const usreId = req.params.usreid;

    // checking id's validitity in the database
    const postExist = await blogs.findById(blogId);
    console.log(postExist);
    const userExist = await users.findById(usreId);

    if (!postExist) {
      return res.status(400).json({ message: "blog not found" });
    }

    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    if (postExist.dislikedBy.includes(usreId)) {
      return res.status(400).json({ message: "Post already disliked" });
    }

    // checking if user already liked then remove like
    if (postExist.likedBy.includes(usreId)) {
      postExist.likedBy.pull(usreId);
      postExist.likes -= 1;
    }

    // creating dislike and storing into the database
    postExist.dislikedBy.push(usreId);
    postExist.dislikes += 1;

    const savedDislikes = await postExist.save();
    res.status(200).json(savedDislikes);
   
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
