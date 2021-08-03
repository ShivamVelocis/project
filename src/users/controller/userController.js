const bcrypt = require("bcrypt");
const sharp = require("sharp");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const { decodeToken } = require("../utils/auth");

const addUser = async function addUser(req, res, next) {
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
      res.status(400);
      res.json({
        success: false,
        message: errorsExtract,
        data: null,
        accesstoken: req.accesstoken,
      });
    } else {
      let User = new userModel(form_data);
      let saveUser = await User.save();
      res.status(201);
      res.json({
        success: true,
        message: CONFIG.USER_ADD_SUCCESS,
        data: saveUser,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
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
    res.status(400);
    res.json({
      success: false,
      message: errorsExtract,
      data: null,
      accesstoken: req.accesstoken,
    });
  } else {
    try {
      let updatedData = await userModel.findOneAndUpdate(
        { _id: id },
        { $set: updatedContent },
        { upsert: true }
      );
      if (updatedData !== undefined && updatedData !== null) {
        res.status(200);
        res.json({
          success: true,
          message: CONFIG.USER_UPDATE_SUCCESS,
          data: null,
          accesstoken: req.accesstoken,
        });
      }
    } catch (error) {
      next(error);
    }
  }
};

const getUser = async function getUser(req, res, next) {
  if (res.locals.validationError) {
    res.status(400);
    res.json({
      success: false,
      message: res.locals.validationError,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
  let id = req.params.id;
  try {
    let userData = await userModel
      .findById(id)
      .select("name email username role_id user_status _id");
    if (userData !== undefined && userData !== null) {
      res.status(200);
      res.json({
        success: true,
        message: CONFIG.USER_USER_DATA,
        data: userData,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getUsers = async function getUsers(req, res, next) {
  try {
    let usersData = await userModel
      .find({})
      .select("name email username role_id user_status _id");
    if (usersData.length > 0) {
      res.status(200);
      res.json({
        success: true,
        message: CONFIG.USER_USER_DATA,
        data: usersData,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      res.json({
        success: false,
        message: CONFIG.NO_DATA_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

const removeUser = async (req, res) => {
  let id = req.body.id;
  try {
    let result = await userModel.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      res.status(200);
      res.json({
        success: true,
        message: CONFIG.USER_REMOVE_SUCCESS,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

const uploadProfilePicture = async (req, res) => {
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
      res.status(200);
      res.json({
        success: true,
        message: CONFIG.USER_IMAGE_UPLOADED,
        data: null,
        accesstoken: req.accesstoken,
      });
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400);
    res.json({
      success: false,
      message: CONFIG.NO_FILE_SELECTED,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
};
const getProfilePicture = async (req, res, next) => {
  try {
    // let userId = req.body.id;
    let { userId } = decodeToken(req.refreshAccessToken);
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

module.exports = {
  addUser,
  updateUser,
  getUsers,
  getUser,
  removeUser,
  uploadProfilePicture,
  getProfilePicture,
};
