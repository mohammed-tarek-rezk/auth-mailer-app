

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail", 
    host: "smtp.gmail.email",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });


  async function sendingEmails(email , verifiedCode) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Email Verification", 
      text: "Hello world?", 
      html: verifiedCode, 
    });
  }
  async function sendingWelcomeEmail(email , name) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Welcome Email", 
      text: "Welcome " + name, 
      html: `<h2>welcome ${name}</h2>`, 
    });
  }
  async function sendingResetPasswordEmail(email , name, resetToken) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Reset Password Email", 
      text: "Welcome " + name, 
      html: `<a href=${resetToken}> Reset password </a>`, 
    });
  }
  async function sendingConfirmResetPassword(email) {
    await transporter.sendMail({
      from: `"Mohamed Tarek" <${process.env.EMAIL_USER}>`, 
      to: email, 
      subject: "Reset Password Email", 
      text: "password reset successfully", 
      html: `Password reset successfully`, 
    });
  }


  module.exports = {sendingEmails , sendingWelcomeEmail , sendingResetPasswordEmail, sendingConfirmResetPassword};