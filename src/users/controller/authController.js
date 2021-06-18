const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");

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
        return res.redirect("/user/login");
      }
      let token = await genrateJWTToken(user._id);
      let result = await userModel.findOneAndUpdate(
        { email: data.email },
        { $set: { token: token } },
        { new: true, upsert: true }
      );
      if (result !== undefined && result !== null) {
        req.flash("success", CONFIG.LOGIN_SUCCESS_MESSAGE);
        res.cookie("token", token);
        return res.redirect("/user/view");
      }
    } else {
      req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
      return res.redirect("/user/login");
      // req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
    }
  } catch (error) {
    req.flash("error", CONFIG.LOGIN_FAIL_MESSAGE);
    return res.redirect("/user/login");
  }
};

let genrateJWTToken = async (id) => {
  console.log(id);
  let token = await jwt.sign(
    {
      userId: id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_LIFE),
    }
  );
  return token;
};
// Number(process.env.ACCESS_TOKEN_LIFE)
