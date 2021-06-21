const nodemailer = require("nodemailer");

let mailOtp = async (mailTo, otp) => {
  // Generate test SMTP service account from ethereal.email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  let forgetPasswordUrl = "localhost:3000/user/pwdreset/";
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'Nodejs Project', // sender address
    to: mailTo, // list of receivers
    subject: "OTP for password recovery", // Subject line
    text: `Link  ${forgetPasswordUrl} and otp is ${otp}`, // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

module.exports = { mailOtp };
