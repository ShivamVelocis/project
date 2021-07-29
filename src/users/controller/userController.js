const bcrypt = require("bcrypt");
const sharp = require("sharp");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const { decodeToken } = require("../utils/auth");

exports.addUser = async function addUser(req, res, next) {
  try {
    var form_data = {
      username: req.body.username,
      role_id: req.body.role_id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      name: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      },
      user_status: req.body.user_status,
    };

    //Validation
    let errorsExtract = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach((item) => {
        errorsExtract.push(item.msg);
      });
      return res.json({
        success: false,
        message: errorsExtract,
        data: null,
      });
    } else {
      let User = new userModel(form_data);
      let saveUser = await User.save();
      return res.json({
        success: true,
        message: "User added successfully",
        data: saveUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res) => {
  let id = req.body.id;
  let updatedContent = req.body;

  //Validation
  let errorsExtract = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsExtract.push(item.msg);
    });
    return res.json({
      success: false,
      message: errorsExtract,
      data: null,
    });
  } else {
    try {
      let updatedData = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: updatedContent },
        { upsert: true }
      );
      if (updatedData !== undefined && updatedData !== null) {
        return res.json({
          success: true,
          message: "User data updated",
          data: null,
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

exports.getUser = async function getUser(req, res, next) {
  if (res.locals.validationError) {
    return res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
    });
  }
  let id = req.params.id;
  try {
    let userData = await userModel
      .findById(id)
      .select("name email username role_id user_status _id");
    if (userData !== undefined && userData !== null) {
      return res.json({
        success: true,
        message: "User data",
        data: userData,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async function getUsers(req, res, next) {
  try {
    let usersData = await userModel
      .find({})
      .select("name email username role_id user_status _id");
    if (usersData.length > 0) {
      return res.json({
        success: true,
        message: "Users data",
        data: usersData,
      });
    } else {
      return res.json({
        success: false,
        message: "No data present",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.removeUser = async (req, res) => {
  let id = req.body.id;
  try {
    let result = await userModel.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      return res.json({
        success: true,
        message: "Users removed",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.uploadProfilePicture = async (req, res) => {
  console.log("user profile");
  let userId = req.body.id;
  if (req.file && req.file.buffer) {
    try {
      let file = await sharp(req.file.buffer)
        .resize(200, 200)
        .png({ quality: 100 })
        .toBuffer();
      await userModel.findByIdAndUpdate(userId, {
        $set: { profilePicture: file },
      });
      return res.json({
        success: true,
        message: "Image uploaded",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  } else {
    return res.json({
      success: false,
      message: "No file selected",
      data: null,
    });
  }
};
exports.getProfilePicture = async (req, res,next) => {
  try {
    // let userId = req.body.id;
    let { userId } = decodeToken(res.locals.refreshAccessToken);
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      res.set("Content-Type", "image/jpeg");
      return res.send(user.profilePicture);
    } else {
      return res.send(null);
    }
  } catch (error) {
    return next(error);
  }
};
