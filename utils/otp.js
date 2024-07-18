const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const otpTemplate = require('../template/otpTemplate');
dotenv.config();
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email, // replace with your email
      pass: process.env.pass // replace with your email password
    }
  });

  const mailOptions = {
    from: process.env.email, // replace with your email
    to: email,
    subject: 'Your OTP Code',
    html: otpTemplate(otp),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendOTP
};
