const bcrypt = require("bcrypt");
const sharp = require("sharp");
const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");
const { decodeToken } = require("../utils/auth");

//Added new user
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

    let isUserNameUnique = await userModel.findOne({
      username: req.body.username,
    });
    let isEmailUnique = await userModel.findOne({ email: req.body.email });

    let uniqError = [];

    if (isUserNameUnique) {
      uniqError.push({ username: "username already in use" });
      // throw new Error("username already in use")
    }

    if (isEmailUnique) {
      uniqError.push({ email: "email already in use" });
    }

    if (uniqError.length) {
      res.status(422);
      return res.json({
        success: false,
        message: uniqError,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    let User = new userModel(form_data);
    let saveUser = await User.save();
    res.status(201);
    return res.json({
      success: true,
      message: CONFIG.USER_ADD_SUCCESS,
      data: saveUser,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    // console.log({ error });
    next(error);
  }
};

//Update exist user
const updateUser = async (req, res, next) => {
  let id = req.body.id;
  let updatedContent = req.body;

  try {
    let isUserNameUnique;
    let isEmailUnique;

    if (req.body.username) {
      isUserNameUnique = await userModel.findOne({
        $and: [{ username: req.body.username }, { _id: { $ne: id } }],
      });
    }
    if (req.body.email) {
      isEmailUnique = await userModel.findOne({
        $and: [{ email: req.body.email }, { _id: { $ne: id } }],
      });
    }
    // unique email

    let uniqError = [];

    if (isUserNameUnique) {
      uniqError.push({ username: "username already in use" });
      // throw new Error("username already in use")
    }

    if (isEmailUnique) {
      uniqError.push({ email: "email already in use" });
    }

    if (uniqError.length) {
      res.status(422);
      return res.json({
        success: false,
        message: uniqError,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    let updatedData = await userModel
      .findOneAndUpdate({ _id: id }, { $set: updatedContent }, { new: true })
      .select("name email username role_id user_status _id");
    if (updatedData !== undefined && updatedData !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.USER_UPDATE_SUCCESS,
        data: updatedData,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
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

//Fetch user with id
const getUser = async function getUser(req, res, next) {
  let id = req.params.id;
  try {
    let userData = await userModel
      .findById(id)
      .select("name email username role_id user_status _id");
    if (userData !== undefined && userData !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.USER_USER_DATA,
        data: userData,
        accesstoken: req.accesstoken,
      });
    } else {
      return res.json({
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

//Fetch all users
const getUsers = async function getUsers(req, res, next) {
  try {
    let usersData = await userModel
      .find({})
      .select("name email username role_id user_status _id");
    if (usersData.length > 0) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.USER_USER_DATA,
        data: usersData,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
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

// Delete user
const removeUser = async (req, res, next) => {
  let id = req.body.id;
  try {
    let result = await userModel
      .findOneAndRemove({ _id: id })
      .select("name email username role_id user_status _id");
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.USER_REMOVE_SUCCESS,
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
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

//Upload user profile picture
const uploadProfilePicture = async (req, res, next) => {
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
      return res.json({
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
    return res.json({
      success: false,
      message: CONFIG.NO_FILE_SELECTED,
      data: null,
      accesstoken: req.accesstoken,
    });
  }
};

//Get user profile picture
const getProfilePicture = async (req, res, next) => {
  try {
    // let userId = req.body.id;
    let { userId } = decodeToken(req.accesstoken);
    let user = await userModel
      .findOne({ _id: userId, user_status: 1 })
      .select("name email username role_id user_status _id profilePicture");
    console.log(user);
    if (user != null && user != undefined && user.profilePicture) {
      res.set("Content-Type", "image/jpeg");
      return res.send(user.profilePicture);
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: "No profile picture found",
        data: null,
        accesstoken: req.accesstoken,
      });
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
