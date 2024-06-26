const User = require("../models/usermodel");
const { generateOTP, sendOTP } = require('../utils/otp'); 

exports.register = async (req, res) => {
  try {
    console.log("hello")
    const { firstname, lastname, password, email, mobile,role,cart,address,wishlist } = req.body;
  console.log(req.body)
   

    // Check if email or mobile number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or mobile number already exists" });
    }

    // Create and save the new user
    const user = new User({ firstname, lastname, password, email, mobile,role,cart,address,wishlist });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: error.message });
  }
}
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("total", req.body);

  try {
    const user = await User.findOne({ email });
    console.log(user);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user && user.password === password) {
      // Generate OTP
      const otp = generateOTP();

      // Save OTP to the user document
      user.otp = otp;
      await user.save();

      // Send OTP via email
      try {
        await sendOTP(email, otp);
        res.status(200).json({ message: `${user.role} Login successful. OTP sent to email`, email });
      } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ error: "Error " + error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email and check OTP
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear the OTP from user document
    user.otp = otp;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findOneAndDelete({ email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateUserByEmail = async (req, res) => {
  const { email } = req.body;  // Extract email from URL params
  const updates = req.body;  // Extract updates from request body

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the password is being updated, hash it before saving
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      //updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = await User.findOneAndUpdate({ email }, updates, { new: true });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleUserBlockByEmail = async (req, res) => {
  const { email } = req.body;
 console.log(email)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isblocked = !user.isblocked;
    await user.save();

    res.status(200).json({ message: `User isblocked status to ${user.isblocked}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/////////////////////
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

