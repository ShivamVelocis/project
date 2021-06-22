var moment = require('moment');
const { check, validationResult } = require('express-validator');
//const userValidaton = require('../validations/users.validator');
const bcrypt = require('bcrypt');

const userModel = require("../models/userModel");
const CONFIG = require('./../configs/config');



exports.addUser = function addUser(req, res, next){
  res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, error: null });
};


exports.postAddUser = async function addUser(req, res, next) {
  if (res.locals.validationError) {
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
          first: 'Dilip',
          last: 'Kumar'
        },
        user_status: req.body.user_status,
        //created_at: moment().format()
    }

    let User = new userModel(form_data);
    let saveUser = await User.save();
    /*
      User.validate(function (err) {
        if (err) handleError(err);
        //else // validation passed
      });
    */
    req.flash('success', CONFIG.INSERT_MESSAGE);
    res.redirect("/user/view");
  } catch (error) {
    req.flash("userData", req.body);
    req.flash('error', error.errors);
     //console.log(error.message);

    res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, error: error });
  }
};


exports.getUser = async function getUser(req, res, next) {
  let id = req.params.id;
  try {
    let result = await userModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("users/views/view", { title: CONFIG.USER, module_title: CONFIG.MODULE_TITLE, results: result });
    }
  } catch (error) {
    res.render("views/error/ErrorPage", { error: "Error while fecting content" });
  }
};


exports.getUsers = async function getUsers(req, res, next) {
  try {
    let contents = await userModel.find({});
    if (contents.length > 0) {
      res.render("users/views/list", { title:CONFIG.USER, module_title: CONFIG.MODULE_TITLE, results: contents });
    }else{
      res.render("views/error/ErrorPage", { error: "No content added yet!" });
    }
  } catch (error) {
    res.render("views/error/ErrorPage", { error: "Unable to get any content" });
  }
};


exports.removeContent = async (req, res) => {
  
  let id = req.body.uid;
  try {
    let result = await userModel.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      req.flash('success', CONFIG.DELETE_MESSAGE);
      res.redirect("/user/view");
    }
  } catch (error) {
    res.render("views/error/ErrorPage", { error: "Error while deleting content" });
  }
};

exports.updateUser = async (req, res) => {
  let id = req.params.id;
 
  try {
    let result = await userModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("users/views/update", { title: CONFIG.UPDATE_TITLE, module_title: CONFIG.MODULE_TITLE, results: result });
    }
  } catch (error) {
    
    res.render("views/error/ErrorPage", { error: "Error while fetching content" });
  }
};

exports.postUpdateUser = async (req, res) => {
  // console.log(req.params.id);
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
      first: 'Dilip',
      last: 'Kumar'
    },
    user_status: req.body.user_status,
    last_login: { type: Date, default: Date.now },
  }

  try {
    let result = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: form_data },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
      req.flash('success', CONFIG.UPDATE_MESSAGE);
      return res.redirect("/user/view");
    }
  } catch (error) {
    req.flash('error', 'Something went wrong!!');
    req.flash("userData", req.body);
    res.render("views/error/ErrorPage", { error: "Error while updating content" });
  }
};
