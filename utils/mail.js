var nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const option = {
  service: "gmail",
  auth: {
    user: "jtf2407@gmail.com", // email hoặc username
    pass: "kfhmlaenoslughkx", // password
  },
};

var transporter = nodemailer.createTransport(option);
const sendMail = asyncHandler(async (toEmail, subject, text) => {
  transporter.verify(function (error, success) {
    // Nếu có lỗi.
    if (error) {
      console.log(error);
    } else {
      //Nếu thành công.
      console.log("Kết nối thành công!");
      var mail = {
        from: "jtf2407@gmail.com", // Địa chỉ email của người gửi
        to: toEmail, // Địa chỉ email của người gửi
        subject: subject, // Tiêu đề mail
        text: text, // Nội dung mail dạng text
      };

      //Tiến hành gửi email
      transporter.sendMail(mail, function (error, info) {
        if (error) {
          // nếu có lỗi
          console.log(error);
        } else {
          //nếu thành công
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
});
module.exports = {
  sendMail,
};
