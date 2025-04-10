const nodemailer = require('nodemailer');
require('dotenv').config();

const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Leave Automation System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Verification Code',
    text: `Your OTP code is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
