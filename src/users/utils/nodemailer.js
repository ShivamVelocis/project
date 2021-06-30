const nodemailer = require("nodemailer");

let mailOtp = async (mailTo, otp, token) => {

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

  let forgetPasswordUrl = `'http://localhost:3000/user/pwdreset/${token}'`;

  let emailBody = `<div><a href=${forgetPasswordUrl} >Reset password</a></div>
    <div id="div2">OTP  ${otp} will expire in 10 min.</div>`;

  // send mail with defined transport object
    transporter.sendMail({
    from: "test@mail.com", // sender address
    to: mailTo, // list of receivers
    subject: "OTP for password recovery", // Subject line
    html: emailBody, // html body
  });
};

module.exports = { mailOtp };
