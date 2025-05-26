import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// PLAIN

// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or 'outlook', 'yahoo', etc.
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    // user: "makinderidwan73@gmail.com",
    // pass: "qdpzehocuegoyzan",
  },
});

const sendEmail = async (to: string, text: string) => {
  const mailOptions = {
    from: `"Product Listing App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
};

export default sendEmail;