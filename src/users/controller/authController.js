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
const userLogin = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    res.status(400);
    return res.json({
      success: false,
      message: res.locals.validationError,
    });
  }
  try {
    let user = await userModel
      .findOne({ email: data.email, user_status: 1 })
      .populate("role_id");

    if (user !== null && user !== undefined) {
      let passwordVerified = await bcrypt.compare(data.password, user.password);
      if (!passwordVerified) {
        res.status(401);
        return res.json({
          success: false,
          message: CONFIG.LOGIN_FAIL_MESSAGE,
          data: null,
        });
      }
      if (!user.role_id) {
        res.status(401);
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
        userRoleId: user.role_id._id,
      };
      // console.log(tokenPayload)
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
        // res.status(); return res.json(responseHandler(true,CONFIG.LOGIN_SUCCESS_MESSAGE,null,token))
        res.status(200);
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: null,
          accesstoken: token,
        });
      } else {
        res.status(401);
        return res.json({
          success: true,
          message: CONFIG.LOGIN_SUCCESS_MESSAGE,
          data: result,
          accesstoken: req.accesstoken,
        });
      }
    } else {
      res.status(401);
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
const forgetPassword = async (req, res, next) => {
  let data = req.body;
  if (res.locals.validationError) {
    res.status(400);
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  try {
    let user = await userModel.findOne({ email: data.email, user_status: 1 });
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
        res.status(200);
        return res.json({
          success: true,
          message: CONFIG.OTP_SUCCESS,
          data: null,
        });
      }
    } else {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.OTP_SUCCESS,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// reset user password after valid OTP and URL
const otpVerification = async (req, res, next) => {
  let token = req.params.token;
  if (res.locals.validationError) {
    res.status(400);
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  try {
    let isUrlTokenVal = await validateToken(token);
    if (!isUrlTokenVal) {
      res.status(400);
      return res.json({
        success: false,
        message: CONFIG.FORGET_PASSWORD_LINK_EXPIRATED,
        data: null,
      });
    }
    let userData = await decodeToken(token);
    let data = req.body;
    let user = await userModel.findOne({
      email: userData.userEmail,
      user_status: 1,
    });
    let crossVerifyTOken = await validateToken(user.otpToken);
    if (!crossVerifyTOken) {
      res.status(400);
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
          { email: userData.userEmail },
          { $set: { otp: null, password: passwordHash, otpToken: null } },
          { upsert: true }
        );
        res.status(200);
        return res.json({
          success: true,
          message: CONFIG.PASSWORD_SUCCESS_CHANGE,
          data: null,
        });
      } else {
        res.status(400);
        return res.json({
          success: false,
          message: CONFIG.WRONG_OTP,
          data: null,
        });
      }
    } else {
      res.status(400);
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

//change password after user provide current and new password
const changePassword = async (req, res, next) => {
  let userData = req.body;
  // console.log(userData)
  
  try {
    let user = await userModel.findOne({ _id: userData.id });
    if (user != null && user != undefined) {
      let newPasswordHash = await bcrypt.hashSync(userData.newPassword, 10);
      await userModel.findOneAndUpdate(
        { _id: userData.id },
        { $set: { password: newPasswordHash } },
        { upsert: true }
      );
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.CHANGE_PASSWORD_SUCCESS,
        data: null,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(400);
      return res.json({
        success: false,
        message: CONFIG.INVALID_USER_ID,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (err) {
    next(err);
  }
};

const changeMyPassword = async (req, res, next) => {
  try {
    let { userId } = decodeToken(req.accesstoken);
    let userData = req.body;

    let user = await userModel.findOne({ _id: userId, user_status: 1 });
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
        res.status(200);
        return res.json({
          success: true,
          message: CONFIG.CHANGE_PASSWORD_SUCCESS,
          data: null,
          accesstoken: req.accesstoken,
        });
      }
      res.status(400);
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

module.exports = {
  userLogin,
  forgetPassword,
  otpVerification,
  changePassword,
  changeMyPassword,
};
