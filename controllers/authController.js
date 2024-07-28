const User = require("../models/usermodel");
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { generateOTP, sendOTP } = require('../utils/otp'); 

exports.register = async (req, res) => {
  try {
    console.log("hello")
    const { firstname, lastname, password, email, mobile,role,cart,address,wishlist,authenticatorSecret} = req.body;
  console.log(req.body)
   
    // Create and save the new user
    const user = new User({ firstname, lastname, password, email, mobile,role,cart,address,wishlist,authenticatorSecret });
    await user.save();
    console.log(user)
    res.status(201).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: error.message }); 
  }
}
    // Check if email or mobile number already exists
    // const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    // if (existingUser) {
    //   return res.status(400).json({ error: "Email or mobile number already exists" });
    // }
    // Check if email already exists
exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists in the database
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json(true); // Email exists
    }

    res.json(false); // Email does not exist
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: error.message });
  }
};

// Check if mobile number already exists
exports.checkMobileExists = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Check if mobile number already exists in the database
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.json(true); // Mobile number exists
    }

    res.json(false); // Mobile number does not exist
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: error.message });
  }
};

exports.setupGoogleAuthenticator = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secret key
    const secret = speakeasy.generateSecret({ length: 20 });
console.log(secret)
    // Save the secret to the user's document
    user.authenticatorSecret = secret.base32;
  
    await user.save();

    // Generate a QR code for the secret
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.ascii,
      label: `ecom (${email})`,
      issuer: 'kannan app'
    });

    QRCode.toDataURL(otpauthUrl, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ message: 'Error generating QR code', error: err });
      }
      res.status(200).json({ message: 'Google Authenticator setup complete', qrCodeUrl: dataUrl });
    });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};
exports.removeGoogleAuthenticator = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the authenticator secret
    user.authenticatorSecret = null;
    await user.save();

    res.status(200).json({ message: 'Google Authenticator removed' });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
};
exports.verifygoogleotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the OTP using the user's authenticatorSecret
    const isValidOTP = speakeasy.totp.verify({
      secret: user.authenticatorSecret,
      encoding: 'base32',
      token: otp,
    //    // Allows for a time step before and after for tolerance
    });

    if (!isValidOTP) {
      return res.status(401).json({ message: 'Invalid google OTP' });
    }

    res.status(200).json({ message: 'google authentication  OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Save new OTP to the user document
    user.otp = otp;
    await user.save();

    // Send OTP via email
    try {
      await sendOTP(email, otp);
      res.status(200).json({ message: `OTP resent to ${email}` });
    } catch (error) {
      res.status(500).json({ message: 'Error sending OTP', error });
    }
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
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

exports.getAuthenticatorSecretByEmail = async (req, res) => {
  const { email } = req.params; // Expecting email as a URL parameter

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the authenticatorSecret
    res.status(200).json({ authenticatorSecret: user.authenticatorSecret });
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

exports.updateUserAddress = async (req, res) => {
  try {
    const { userid } = req.params;
    const { address } = req.body;

    // Find the user by ID and update the address field
    const user = await User.findByIdAndUpdate(
      userid,
      { address: address },
      { new: true } // This option returns the updated document
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Address updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//
