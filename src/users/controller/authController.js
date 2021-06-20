const moment = require("moment");
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const { genrateJWTToken } = require("../utils/auth");

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
