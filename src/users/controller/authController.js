const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const {
  generateJWTToken,
  validateToken,
  decodeToken,
} = require("../utils/auth");
// const { responseHandler } = require("../utils/responseHandler");
const { sendOtpMail } = require(`../utils/${process.env.EMAIL_SERVICE}`);

//  handler for login form and redirect to users after success login
exports.userLogin = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  try {
    let user = await userModel
      .findOne({ email: data.email, user_status: 1 })
      .populate("role_id");

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
        userRole: user.role_id.title,
      };
      console.log(tokenPayload)
      let token = await generateJWTToken(
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
        // return res.json(responseHandler(true,CONFIG.LOGIN_SUCCESS_MESSAGE,null,token))
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: null,
          accesstoken: token,
        });
      } else {
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: result,
          accesstoken: req.accesstoken,
        });
      }
    } else {
      return res.json({
        success: false,
        message: CONFIG.LOGIN_FAIL_MESSAGE,
        data: null,
        accesstoken: req.accesstoken,
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
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  try {
    let user = await userModel.findOne({ email: data.email });
    if (user !== null && user !== undefined) {
      let otp = Math.floor(1000 + Math.random() * 9000);
      let token = await generateJWTToken(
        { userEmail: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        process.env.OTP_LIFE
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
          success: true,
          message: CONFIG.OTP_SUCCESS,
          data: null,
          accesstoken: req.accesstoken,
        });
      }
    } else {
      return res.json({
        success: true,
        message: CONFIG.OTP_SUCCESS,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// reset user password after valid OTP and URL
exports.otpVerification = async (req, res, next) => {
  let token = req.params.token;
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  try {
    let isUrlTokenVal = await validateToken(token);
    if (!isUrlTokenVal) {
      return res.json({
        success: false,
        message: CONFIG.FORGET_PASSWORD_LINK_EXPIRATED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    let userData = await decodeToken(token);
    let data = req.body;
    let user = await userModel.findOne({ email: userData.userEmail });
    let crossVerifyTOken = await validateToken(user.otpToken);
    if (!crossVerifyTOken) {
      return res.json({
        success: false,
        message: CONFIG.FORGET_PASSWORD_LINK_EXPIRATED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    if (user !== null && user !== undefined) {
      if (user.otp == data.otp) {
        let passwordHash = await bcrypt.hashSync(data.password, 10);
        await userModel.findOneAndUpdate(
          { email: userData.userEmail },
          { $set: { otp: null, password: passwordHash, otpToken: null } },
          { upsert: true }
        );
        return res.json({
          success: true,
          message: CONFIG.PASSWORD_SUCCESS_CHANGE,
          data: null,
          accesstoken: req.accesstoken,
        });
      } else {
        return res.json({
          success: false,
          message: CONFIG.WRONG_OTP,
          data: null,
          accesstoken: req.accesstoken,
        });
      }
    } else {
      return res.json({
        success: false,
        message: CONFIG.INVALID_EMAIL,
        data: null,
        accesstoken: req.accesstoken,
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
  let userData = req.body;
  // console.log(userData)
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  try {
    let user = await userModel.findOne({ _id: userData.id });
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
        accesstoken: req.accesstoken,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid user ID",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.changeMyPassword = async (req, res, next) => {
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  try {
    let { userId } = decodeToken(req.refreshAccessToken);
    let userData = req.body;

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
          accesstoken: req.accesstoken,
        });
      }
      return res.json({
        success: false,
        message: CONFIG.CHANGE_PASSWORD_ERROR,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (err) {
    next(err);
  }
};
