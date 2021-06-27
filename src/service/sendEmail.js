require('dotenv/config');
const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: 'the.wall.app.email.2021@gmail.com',
      to: userEmail,
      subject: 'Wellcome to The Wall',
      text: `Hello! ${userName}, welcome to The Wall App and thanks for using it.`
    });

  } catch (error) {
    throw error;
  }
}

module.exports = sendEmail;
