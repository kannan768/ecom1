const nodemailer = require('nodemailer');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kannanbsk1609080@gmail.com', // replace with your email
      pass: 'lojg yfod ryca cfrc' // replace with your email password
    }
  });

  const mailOptions = {
    from: 'kannanbsk1609080@gmail.com', // replace with your email
    to: email,
    subject: 'Your OTP Code',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #333;
              margin-bottom: 20px;
            }
            p {
              margin-bottom: 20px;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
            }
            .note {
              color: #666;
              font-style: italic;
            }
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ccc;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>OTP Verification</h2>
            <p>Your OTP code is <span class="otp">${otp}</span></p>
            <p class="note">Please do not share this OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>This is an automated email, please do not reply.</p>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendOTP
};
