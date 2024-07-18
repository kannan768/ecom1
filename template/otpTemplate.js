const otpTemplate = (otp) => `
  <html>
    <head>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #4CAF50;
          margin-bottom: 20px;
          text-align: center;
        }
        p {
          margin-bottom: 20px;
          font-size: 16px;
          line-height: 1.5;
          color: #333333;
        }
        .otp {
          display: inline-block;
          font-size: 24px;
          font-weight: bold;
          color: #ffffff;
          background-color: #007bff;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
          text-align: center;
        }
        .note {
          color: #666666;
          font-style: italic;
          text-align: center;
        }
        .footer {
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
          font-size: 12px;
          color: #666666;
          text-align: center;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header img {
          width: 100px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333333;
        }
        .button {
          display: inline-block;
          font-size: 18px;
          font-weight: bold;
          color: #ffffff;
          background-color: #4CAF50;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          margin: 20px 0;
          text-align: center;
        }
        .content {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
         
          <h1>kannan</h1>
        </div>
        <h2>OTP Verification</h2>
        <div class="content">
          <p>Dear User,</p>
          <p>To complete your login, please use the following OTP code:</p>
          <div class="otp">${otp}</div>
          <p class="note">Please do not share this OTP with anyone. If you did not request this OTP, please contact our support team immediately.</p>
          <a href="#" class="button">Contact Support</a>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; 2024 Company Name. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

module.exports = otpTemplate;
