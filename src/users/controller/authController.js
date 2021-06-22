const moment = require("moment");
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const { genrateJWTToken } = require("../utils/auth");
const { mailOtp } = require("../utils/nodemailer");

exports.login = (req, res) => {
  res.render("users/views/auth/login");
};

exports.postLogin = async (req, res) => {
  let data = req.body;
  try {
    let user = await userModel.findOne({ email: data.email });
    if (user !== null && user !== undefined) {
      let passwordVerified = await bcrypt.compare(data.password, user.password);
      if (!passwordVerified) {
        req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
        return res.redirect("/user/auth/login");
      }
      // console.log("test",process.env.ACCESS_TOKEN_SECRET);
      let token = await genrateJWTToken(
        user._id,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      );
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { token: token } },
        { new: true, upsert: true }
      );
      if (result !== undefined && result !== null) {
        req.flash("success", CONFIG.LOGIN_SUCCESS_MESSAGE);
        req.session.token = token;
        return res.redirect("/user/view");
      }
    } else {
      req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
      return res.redirect("/user/auth/login");
    }
  } catch (error) {
    console.log(error);
    req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
    return res.redirect("/user/auth/login");
  }
};

exports.forgetPassword = (req, res) => {
  res.render("users/views/auth/forgetPwd");
};

exports.postForgetPassword = async (req, res) => {
  let data = req.body;
  try {
    let user = await userModel.findOne({ email: data.email });
    if (user !== null && user !== undefined) {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { otp: otp } },
        { new: true, upsert: true }
      );
      if (result !== undefined && result !== null) {
        console.log(otp);
        await mailOtp(data.email, otp);
        // console.log(mailed);

        req.flash("success", CONFIG.OTP_SUCCESS);
        // req.session.token = token;
        return res.redirect("/user/pwdreset/");
      }
    } else {
      req.flash("error", CONFIG.NOT_REGISTER_USER);
      return res.redirect(req.originalUrl);
    }
  } catch (error) {
    console.log(error);
    req.flash("error", CONFIG.NOT_REGISTER_USER);
    return res.redirect(req.originalUrl);
  }
};

exports.otpVerification = (req, res) => {
  return res.render("users/views/auth/otpValidation");
};
exports.postOtpVerification = async (req, res) => {
  // console.log("postOtpVerification");
  try {
    const data = req.body;
    let user = await userModel.findOne({ email: data.email });
    if (user !== null && user !== undefined) {
      if (user.otp == data.otp) {
        let passwordHash = bcrypt.hashSync(req.body.password, 10);
        await userModel.findOneAndUpdate(
          { email: data.email },
          { $set: { otp: null, password: passwordHash } },
          { upsert: true }
        );
        req.flash("success", CONFIG.PASSWORD_SUCCESS_CHANGE);
        return res.redirect("/user/auth/login");
      } else {
        req.flash("error", "Invalid OTP");
        return res.redirect("/user/pwdreset");
      }
    } else {
      console.error("email error");
      req.flash("error", CONFIG.INVALID_EMAIL);
      return res.redirect(req.originalUrl);
    }
  } catch (error) {
    console.log(error);
  }
};

