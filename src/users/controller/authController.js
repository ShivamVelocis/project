const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const {
  genrateJWTToken,
  validateToken,
  decodeToken,
} = require("../utils/auth");
const { sendOtpMail } = require(`../utils/${process.env.EMAIL_SERVICE}`);

//  handler for login form and redirect to users after success login
exports.userLogin = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  try {
    let user = await userModel.findOne({ email: data.email, user_status: 1 });

    if (user !== null && user !== undefined) {
      let passwordVerified = await bcrypt.compare(data.password, user.password);
      if (!passwordVerified) {
        return res.json({
          success: false,
          message: CONFIG.LOGIN_FAIL_MESSAGE,
          data: null,
        });
      }
      let tokenPayload = {
        userId: user._id,
        userName: user.name.first_name,
        userRole: user.role_id,
      };
      let token = await genrateJWTToken(
        tokenPayload,
        process.env.ACCESS_TOKEN_SECRET,
        process.env.ACCESS_TOKEN_LIFE
      );
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { token: token } },
        { upsert: true }
      );
      if (result !== undefined && result !== null) {
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: null,
          token:token
        });
      } else {
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: result,
        });
      }
    } else {
      return res.json({
        success: false,
        message: CONFIG.LOGIN_FAIL_MESSAGE,
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

// email OTP and URL for user for password reset
exports.forgetPassword = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    return res.json({
      error: res.locals.validationError,
      data: null,
      message: null,
    });
  }
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
        // await mailOtp(data.email, otp, token);
        await sendOtpMail(data.email, otp, token);
        return res.json({
          error: null,
          data: null,
          message: CONFIG.OTP_SUCCESS,
        });
      }
    } else {
      return res.json({
        error: null,
        data: null,
        message: "OTP sent successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

// reset user password after valid OTP and URL
exports.postOtpVerification = async (req, res, next) => {
  let token = req.params.token;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message:  res.locals.validationError,
      data: null,
    });
  }
  try {
    let isUrlTokenVal = await validateToken(token);
    if (!isUrlTokenVal) {
      return res.json({
        success: false,
        message: CONFIG.FORGET_PASSWORD_LINK_EXPIRATED,
        data: null,
      });
    }
    let userData = await decodeToken(token);
    let data = req.body;
    let user = await userModel.findOne({ email: userData.userId });
    let crossVerifyTOken = await validateToken(user.otpToken);
    if (!crossVerifyTOken) {
      return res.json({
        success: false,
        message: CONFIG.FORGET_PASSWORD_LINK_EXPIRATED,
        data: null,
      });
      
    }
    if (user !== null && user !== undefined) {
      if (user.otp == data.otp) {
        let passwordHash = await bcrypt.hashSync(data.password, 10);
        await userModel.findOneAndUpdate(
          { email: userData.userId },
          { $set: { otp: null, password: passwordHash, otpToken: null } },
          { upsert: true }
        );
        return res.json({
          success: true,
          message: CONFIG.PASSWORD_SUCCESS_CHANGE,
          data: null,
        });
      } else {
        return res.json({
          success: false,
          message: CONFIG.WRONG_OTP,
          data: null,
        });
      }
    } else {
      return res.json({
        success: false,
        message: CONFIG.INVALID_EMAIL,
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.logOut = (req, res, next) => {
  req.session.destroy();
  return res.redirect("/user/auth/login");
};

//change password after user provide current and new password
exports.changePassword = async (req, res, next) => {
  let userId = req.params.id;
  let userData = req.body;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      let newPasswordHash = await bcrypt.hashSync(userData.newPassword, 10);
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { password: newPasswordHash } },
        { upsert: true }
      );
      return res.json({
        success: false,
        message: CONFIG.CHANGE_PASSWORD_SUCCESS,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.changeMyPassword = async (req, res, next) => {
  let userId = res.locals.user.userId;
  let userData = req.body;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      let oldPasswordVerified = await bcrypt.compare(
        userData.currentPassword,
        user.password
      );
      if (oldPasswordVerified) {
        let newPasswordHash = await bcrypt.hashSync(userData.newPassword, 10);
        await userModel.findOneAndUpdate(
          { _id: userId },
          { $set: { password: newPasswordHash } },
          { upsert: true }
        );
        return res.json({
          success: true,
          message: CONFIG.CHANGE_PASSWORD_SUCCESS,
          data: null,
        });
      }
      return res.json({
        success: false,
        message: CONFIG.CHANGE_PASSWORD_ERROR,
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
};
