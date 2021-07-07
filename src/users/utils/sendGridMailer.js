const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sendOtpMail = async (mailTo, otp, token) => {
  let forgetPasswordUrl = `${process.env.APP_URL}/user/pwdreset/${token}`;

  let emailBody = `<div><a href="${forgetPasswordUrl}" >Forget password</a></div>
    <div id="div2">OTP  ${otp} will expire in 10 min.</div>`;


  const msg = {
    to: mailTo, // Change to your recipient
    from: process.env.MAIL_SENDR_EMAIL, // Change to your verified sender
    subject: process.env.OTP_MAIL_SUBJECT,
    // text: 'and easy to do anywhere, even with Node.js',
    html: emailBody,
  };
  await sgMail.send(msg);
};

module.exports = { sendOtpMail };
