const bcrypt = require("bcrypt");
const sharp = require('sharp');

const { validationResult } = require('express-validator');
const userModel = require("../models/userModel");
const roleModel = require("./../../roleManagement/models/rolemodel");
const CONFIG = require("./../configs/config");
const { exportToExcel, generateHeaderRow } = require("../../utils/exportToExcel");
const { exportToCSV } = require("../../utils/exportToCSV");

exports.addUser = async function addUser(req, res, next){
  var form_data = {
    username: '',
    role_id: '',
    email: '',
    password: '',
    name: {
      first_name: '',
      last_name: ''
    },
    user_status: '',
    //created_at: moment().format()
}
  let roles = await roleModel.find({});
  //console.log("-----------------------------------",roles);
  res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, formData: form_data, roles: roles, error: null });
};

exports.postAddUser = async function addUser(req, res, next) {
  try {
    var form_data = {
        username: req.body.username,
        role_id: req.body.role_id,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        name: {
          first_name: req.body.first_name,
          last_name: req.body.last_name
        },
        user_status: req.body.user_status,
        //created_at: moment().format()
    }
    //console.log(form_data);
    let roles = await roleModel.find({});

    //Validation
    let errorsExtract = [];
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
       let errors= Object.values(validationErrors.mapped());
       errors.forEach((item) =>{
          errorsExtract.push(item.msg);
        })
        req.flash('error',errorsExtract);
        res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, formData: form_data, roles: roles });
      }else{

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
      }
  } catch (error) {
      req.flash('error', error.errors);
      console.log(error.message);
      res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, error: error });
  }
};

exports.updateUser = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await userModel.findById(id);
    let roles = await roleModel.find({});
    if (result !== undefined && result !== null) {
      return res.render("users/views/update", { title: CONFIG.UPDATE_TITLE, module_title: CONFIG.MODULE_TITLE, results: result, roles: roles });
    }
  } catch (error) {
    res.render("error/ErrorPage", { error: "Error while fetching content" });
  }
};

exports.postUpdateUser = async (req, res) => {
  // console.log(req.params.id);
  let id = req.params.id;
  let updatedContent = req.body;

  var form_data = {
    role_id: req.body.role_id,
    email: req.body.email,
    name: {
      first_name: req.body.first_name,
      last_name: req.body.last_name
    },
    user_status: req.body.user_status,
    last_login: { type: Date, default: Date.now },
  }
  let result = await userModel.findById(id);
    let roles = await roleModel.find({});
  
  //Validation
  let errorsExtract = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()){
     let errors= Object.values(validationErrors.mapped());
     errors.forEach((item) =>{
        errorsExtract.push(item.msg);
      })
      req.flash('error',errorsExtract);
      //res.render("users/views/add", { title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, formData: form_data, roles: roles });
      
     res.render("users/views/update", { title: CONFIG.UPDATE_TITLE, module_title: CONFIG.MODULE_TITLE, results: form_data, roles: roles });
    }else{

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
    res.render("error/ErrorPage", { error: "Error while updating content" });
  }
}
}

//render user with given ID
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

//render list of users
exports.getUsers = async function getUsers(req, res, next) {
  try {
    let contents = await userModel.find({});
    if (contents.length > 0) {
      res.render("users/views/list", {
        title: CONFIG.USER_LIST_TITLE,
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

// remove/delete user from db with given ID
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

// render upload profile picture page for user  with given id
exports.uploadProfilePicture = async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user != null && user != undefined) {
      res.render("users/views/addPic",{result:user,title: CONFIG.UPLOAD_PICTURE_TITLE,
        module_title: CONFIG.MODULE_TITLE,})
    } else {
      res, send(null);
    }
  } catch (error) {
    console.log(error)
  }
};

//update/add profile picture of user if valid image uploaded.
exports.postUploadProfilePicture = async (req, res) => {
  let userId = req.params.id;
  if(req.file && req.file.buffer){
    try {
      let file = await sharp(req.file.buffer)
      .resize(200, 200)
      .png({quality:100})
      .toBuffer();;
      await userModel.findByIdAndUpdate(userId, { $set: { profilePicture: file } });
      req.flash("success", CONFIG.PROFILE_PICTURE_SUCCESS);
      res.redirect(`/user/view/${userId}`)
    } catch (error) {
      req.flash('error', error)
      req.flash('oldUserData', req.file.buffer)
      res.redirect(`/user/upload/profile/${userId}`)
    }
  }else{
     req.flash('error', "Please select a image to upload")
    res.redirect(`/user/upload/profile/${userId}`)
  }
  
};

// send user profile picture if saved in db 
exports.getProfilePicture = async (req, res) => {
  let userId = req.params.id;
  // console.log(userId)
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

exports.getUsersExcel =async (req, res, next) =>{
  try {
    let contents = await userModel.find({}).select({name:1, username:1,email:1,user_status:1});
    if (contents.length > 0) {
    //   const data = contents.map(user => {
    //     let user_status = "";
    //     if (user.user_status) {
    //         user_status = "Active"
    //     } else {
    //         user_status = "Inactive"
    //     }
    //     return {
    //         first_name: user.name.first_name,
    //         last_name: user.name.last_name,
    //         username: user.username,
    //         email: user.email
    //     };
    // });
    // console.log(data)
    // let headerRow = [
    //   {
    //     header: "First Name",
    //     key: "first_name",
    //     width: 20,
    //   },
    //   {
    //     header: "Last Name",
    //     key: "last_name",
    //     width: 20,
    //   },
    //   {
    //     header: "Username",
    //     key: "username",
    //     width: 15,
    //   },
    //   {
    //     header: "Email",
    //     key: "email",
    //     width: 30,
    //   },
    //   {
    //     header: "Status",
    //     key: "status",
    //     width: 15,
    //   },
    // ];
    // res.status(500);
    // res.send(null);
      let [headerRow, restructureData] = generateHeaderRow(contents,["email","name"])
      let excelBuffer = await exportToExcel(headerRow, restructureData,"Users")
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "UsersData.xlsx");
      res.send(excelBuffer);
    } else {
      res.status(500)
      res.send(null);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(null);
  
  }
};

exports.getUsersCsv = async (req, res, next) => {
  try {
    let contents = await userModel
      .find({})
      .select({ name: 1, username: 1, email: 1, user_status: 1 });
    if (contents.length > 0) {
      const data = contents.map((user) => {
        let user_status = "";
        if (user.user_status) {
          user_status = "Active";
        } else {
          user_status = "Inactive";
        }
        return {
          first_name: user.name.first_name,
          last_name: user.name.last_name,
          username: user.username,
          email: user.email,
        };
      });

      let csv = exportToCSV("", data);
      res.attachment('customers.csv').send(csv)
      // res.send(csv);
    } else {
      res.send("error");
    }
  } catch (error) {
    res.send(error.message);
  }
};