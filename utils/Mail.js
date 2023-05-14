const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const { templateVerifyAccount } = require("../templates/TemplateVerifyAccount");
const { templateResetPassword } = require("../templates/TemplateResetPassword");
const { templateAfterOrders } = require("../templates/TemplateAfterOrders");

const sendVerifyAccountMail = asyncHandler(async (email, subject, data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: process.env.SERVICE,
    // port: 587,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: templateVerifyAccount(data),
  });

  console.log("email sent sucessfully");
});

const sendResetPassword = asyncHandler(async (email, subject, data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: process.env.SERVICE,
    // port: 587,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: templateResetPassword(data),
  });

  console.log("email sent sucessfully");
});

const sendAfterOrders = asyncHandler(async (email, subject, data) => {
  console.log(1);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    // service: process.env.SERVICE,
    // port: 587,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: templateAfterOrders(data),
  });

  console.log("email sent sucessfully");
});

module.exports = {
  sendVerifyAccountMail,
  sendResetPassword,
  sendAfterOrders,
};
