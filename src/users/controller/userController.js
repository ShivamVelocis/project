const bcrypt = require("bcrypt");
const sharp = require('sharp');

const userModel = require("../models/userModel");
const CONFIG = require("./../configs/config");

exports.addUser = function addUser(req, res, next) {
  res.render("users/views/add", {
    title: CONFIG.ADD_TITLE,
    module_title: CONFIG.MODULE_TITLE,
    error: null,
  });
};

exports.postAddUser = async function addUser(req, res, next) {
  if (res.locals.validationError) {
    // console.log(res.locals.validationError)
    req.flash("error", res.locals.validationError);
    req.flash("userData", req.body);
    return res.redirect(`/user/add`);
  }
  try {
    var form_data = {
      username: req.body.username,
      role_id: req.body.role_id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      name: {
        first: "Dilip",
        last: "Kumar",
      },
      user_status: req.body.user_status,
    };
    let uniqueEmail = await userModel.find({ email: req.body.email });

    let uniqueUserName = await userModel.find({ username: req.body.username });
    if (uniqueUserName.length > 0 || uniqueEmail.length > 0) {
      let errorMessage = [];
      uniqueUserName.length > 0 && errorMessage.push("Username already taken");
      uniqueEmail.length > 0 && errorMessage.push("Email already taken");
      throw errorMessage;
    }
    let User = new userModel(form_data);
    let saveUser = await User.save();

    req.flash("success", CONFIG.INSERT_MESSAGE);
    res.redirect("/user/view");
  } catch (error) {
    console.log(error.errors);
    req.flash("userData", req.body);
    req.flash("error", error.errors ? error.errors : error);
    res.render("users/views/add", {
      title: CONFIG.ADD_TITLE,
      module_title: CONFIG.MODULE_TITLE,
      error: error,
    });
  }
};

exports.getUser = async function getUser(req, res, next) {
  if (res.locals.validationError) {
    // console.log(res.locals.validationError)
    req.flash("error", res.locals.validationError);
    return res.render("views/error/ErrorPage", {
      error: res.locals.validationError,
    });
  }
  let id = req.params.id;
  try {
    let result = await userModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("users/views/view", {
        title: CONFIG.USER,
        module_title: CONFIG.MODULE_TITLE,
        results: result,
      });
    }
  } catch (error) {
    res.render("views/error/ErrorPage", {
      error: "Error while fecting content",
    });
  }
};

exports.getUsers = async function getUsers(req, res, next) {
  try {
    let contents = await userModel.find({});
    if (contents.length > 0) {
      res.render("users/views/list", {
        title: CONFIG.USER,
        module_title: CONFIG.MODULE_TITLE,
        results: contents,
      });
    } else {
      res.render("views/error/ErrorPage", { error: "No content added yet!" });
    }
  } catch (error) {
    res.render("views/error/ErrorPage", { error: "Unable to get any content" });
  }
};

exports.removeContent = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    return res.render("views/error/ErrorPage", {
      error: res.locals.validationError,
    });
  }
  let id = req.body.uid;
  try {
    let result = await userModel.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      req.flash("success", CONFIG.DELETE_MESSAGE);
      res.redirect("/user/view");
    }
  } catch (error) {
    res.render("views/error/ErrorPage", {
      error: "Error while deleting content",
    });
  }
};

exports.updateUser = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    return res.render("views/error/ErrorPage", {
      error: res.locals.validationError,
    });
  }
  let id = req.params.id;

  try {
    let result = await userModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("users/views/update", {
        title: CONFIG.UPDATE_TITLE,
        module_title: CONFIG.MODULE_TITLE,
        results: result,
      });
    }
  } catch (error) {
    res.render("views/error/ErrorPage", {
      error: "Error while fetching content",
    });
  }
};

exports.postUpdateUser = async (req, res) => {
  let id = req.params.id;
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("userData", req.body);
    return res.redirect(`/user/update/${id}`);
  }
  let updatedContent = req.body;

  var form_data = {
    role_id: req.body.role_id,
    email: req.body.email,
    name: {
      first: "Dilip",
      last: "Kumar",
    },
    user_status: req.body.user_status,
    last_login: { type: Date, default: Date.now },
  };

  try {
    let uniqueEmail = await userModel.find({ email: req.body.email });

    if (uniqueEmail.length > 0) {
      let errorMessage = [];
      uniqueEmail.length > 0 && errorMessage.push("Email already taken");
      throw errorMessage;
    }
    let result = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: form_data },
      { upsert: true }
    );
    if (result !== undefined && result !== null) {
      req.flash("success", CONFIG.UPDATE_MESSAGE);
      return res.redirect("/user/view");
    }
  } catch (error) {
    console.log(error)
    req.flash("error", error.errors ? error.errors : error);
    req.flash("userData", req.body);
    res.redirect(`/user/update/${id}`);
  }
};

exports.uploadProfilePicture = async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      res.render("users/views/addPic",{result:user,title: CONFIG.ADD_TITLE,
        module_title: CONFIG.MODULE_TITLE,})
    } else {
      res, send(null);
    }
  } catch (error) {
    console.log(error)
  }
};

exports.postUploadProfilePicture = async (req, res) => {
  let userId = req.params.id;
  try {
    let file = await sharp(req.file.buffer)
    .resize(320, 240)
    .png()
    .toBuffer();;
    await userModel.findByIdAndUpdate(userId, { $set: { profilePicture: file } });
    res.redirect(`/user/view/${userId}`)
  } catch (error) {
    console.log(error)
    req.flash('error', error)
    req.flash('oldUserData', req.file.buffer)
    res.redirect(`/upload/profile/${userId}`)
  }
};


exports.getProfilePicture = async (req, res) => {
  let userId = req.params.id;
  console.log(userId)
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      // res.render("users/views/addPic",{result:user,title: CONFIG.ADD_TITLE,
      //   module_title: CONFIG.MODULE_TITLE,})
      res.set("Content-Type", "image/jpeg");
      res.send(user.profilePicture);
    } else {
      res, send(null);
    }
  } catch (error) {
    console.log(error)
  }
};