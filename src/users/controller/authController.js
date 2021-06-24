const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const {
  genrateJWTToken,
  validateToken,
  decodeToken,
} = require("../utils/auth");
const { mailOtp } = require("../utils/nodemailer");

// render login page
exports.login = (req, res, next) => {
  res.render("users/views/auth/login", {
    title: CONFIG.LOGIN_TITLE,
    module_title: CONFIG.MODULE_TITLE,
  });
};

// post handler for login form and redirect to users after success login
exports.postLogin = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("loginData", req.body);
    return res.redirect(`/user/auth/login`);
  }
  try {
    let user = await userModel.findOne({ email: data.email });

    if (user !== null && user !== undefined) {
      let passwordVerified = await bcrypt.compare(data.password, user.password);
      if (!passwordVerified) {
        // console.log(passwordVerified);
        req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
        req.flash("loginData", req.body);
        return res.redirect("/user/auth/login");
      }
      let token = await genrateJWTToken(
        user._id,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      );
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { token: token } },
        { upsert: true }
      );
      if (result !== undefined && result !== null) {
        req.flash("success", CONFIG.LOGIN_SUCCESS_MESSAGE);
        req.session.token = token;
        return res.redirect("/user/view");
      }
    } else {
      req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
      req.flash("loginData", req.body);
      return res.redirect("/user/auth/login");
    }
  } catch (error) {
    next(error);
  }
};

// render forget password page for user email
exports.forgetPassword = (req, res, next) => {
  res.render("users/views/auth/forgetPwd", {
    title: CONFIG.FORGET_PASSWORD_TITLE,
    module_title: CONFIG.MODULE_TITLE,
  });
};

// email OTP and URL for user for password reset
exports.postForgetPassword = async (req, res, next) => {
  let data = req.body;
  try {
    let user = await userModel.findOne({ email: data.email });
    if (user !== null && user !== undefined) {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let token = await genrateJWTToken(
        user.email,
        process.env.ACCESS_TOKEN_SECRET,
        60 * 10
      );
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { otp: otp, otpToken: token } },
        { upsert: true }
      );
      if (result !== undefined && result !== null) {
        await mailOtp(data.email, otp, token);
        req.flash("success", CONFIG.OTP_SUCCESS);
        return res.redirect("/user/auth/login");
      }
    } else {
      req.flash("success", CONFIG.OTP_SUCCESS);
      return res.redirect("/user/auth/login");
    }
  } catch (error) {
    next(error);
  }
};
//render form for user OTP and new password after validating URL

exports.otpVerification = async (req, res, next) => {
  try {
    let token = req.params.token;
    let userData = await userModel.findOne({ otpToken: token });
    if (!userData) {
      req.flash("error", "Link expired");
      return res.redirect("/user/forgetpassword");
    }
    let isUrlTokenVal = await validateToken(token);
    if (!isUrlTokenVal) {
      req.flash("error", "Link expired");
      return res.redirect("/user/forgetpassword");
    }
    return res.render("users/views/auth/otpValidation", {
      data: token,
      title: CONFIG.RESET_PASSWORD_TITLE,
      module_title: CONFIG.MODULE_TITLE,
    });
  } catch (error) {
    next(error);
  }
};

// reset user password after valid OTP and URL
exports.postOtpVerification = async (req, res, next) => {
  let token = req.params.token;
  try {
    let isUrlTokenVal = await validateToken(token);
    if (!isUrlTokenVal) {
      req.flash("error", "Link expired");
      return res.redirect("/user/forgetpassword");
    }
    let userData = await decodeToken(token);
    let data = req.body;
    let user = await userModel.findOne({ email: userData.userId });
    let crossVerifyTOken = await validateToken(user.otpToken);
    if (!crossVerifyTOken) {
      req.flash("error", "Link expired");
      return res.redirect("/user/forgetpassword");
    }
    if (user !== null && user !== undefined) {
      if (user.otp == data.otp) {
        let passwordHash = bcrypt.hashSync(req.body.password, 10);
        await userModel.findOneAndUpdate(
          { email: userData.userId },
          { $set: { otp: null, password: passwordHash, otpToken: null } },
          { upsert: true }
        );
        req.flash("success", CONFIG.PASSWORD_SUCCESS_CHANGE);
        return res.redirect("/user/auth/login");
      } else {
        req.flash("error", "Invalid OTP");
        return res.redirect(`/user/pwdreset/${token}`);
      }
    } else {
      req.flash("error", CONFIG.INVALID_EMAIL);
      return res.redirect(req.originalUrl);
    }
  } catch (error) {
    next(error);
  }
};

exports.logOut = (req, res, next) => {
  req.session.destroy();
  return res.redirect("/user/auth/login");
};
