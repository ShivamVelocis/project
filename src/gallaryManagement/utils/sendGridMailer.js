const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const {resetPwdBody}=require('./pwdResetHtmlBody')

sendOtpMail = async (mailTo, otp, token) => {
  let forgetPasswordUrl = `"${process.env.APP_URL}/user/pwdreset/${token}"`;
  // let emailBody = `<div><a href=${forgetPasswordUrl}>Forget password</a></div><div id="div2">OTP  ${otp} will expire in 10 min.</div>`;
  const msg = {
    to: mailTo,
    from: process.env.MAIL_SENDR_EMAIL,
    subject: process.env.OTP_MAIL_SUBJECT,
    html: resetPwdBody(forgetPasswordUrl,otp),
  };
  await sgMail.send(msg);
};

module.exports = { sendOtpMail };
