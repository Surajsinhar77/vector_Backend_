const nodemailer = require('nodemailer');
require("dotenv").config();
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2'
  },
});

const sendEmail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to: to,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);

    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
};

module.exports = sendEmail;
