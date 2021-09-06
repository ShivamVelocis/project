const Role = require("../models/rolemodel.js");
const Configs = require("../configs/config");
const { check, validationResult } = require('express-validator');
exports.addRole = async (req, res) => {
	console.log("jyoti");
  try {
	  var name=req.body.title.replace(' ','_');
	  console.log(name);
	 var form_data = {
	  role_name:name,
      role_title: req.body.title,
      role_status: req.body.status,
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
      let role = new Role(form_data);
      let saveRole = await role.save();
      return res.json({
		       success:true,
               message: "Role added successfully",
              data: saveRole,
			  
      });
    }

  } catch (error) {
	  console.log(error);
	  return res.json({
		       success:false,
               message: "title already exist in database",
			  
      });
     
  }
};

exports.getAllRole = async (req, res) => {
  try {
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
    }else{
    let resultdata = await Role.find({});
	return res.json({
        success: true,
        message: "All Role fetch successfully",
        data: resultdata,
      });
  }
  
  } catch (error) {
         console.log(error);
    }
};


exports.removeRole = async (req, res) => {
  let id = req.params.id;
 // console.log(id);
  try {
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
    }else{
		 let result = await Role.findOneAndRemove({ _id: id });
		  if (result !== undefined && result !== null) {
		 return res.json({
		       success:true,
               message: "Role deleted successfully", 
      });
		  }else{
			  res.status(404);
            return res.json({
             success: false,
            message: "role id does not exist in database",
            data: [],
           accesstoken: req.accesstoken,
      });
		  }
	}
  } catch (error) {
	  console.log(error);
  }
};

exports.updateRole = async (req, res,next) => {
  let id = req.body.id;
  var updatedRole = {
      role_title: req.body.title,
      role_status: req.body.status,
    };
  try {
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
    }else{
    let result = await Role.findOneAndUpdate(
      { _id: id },
      { $set: updatedRole },
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "role updtaed successfully",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: "role id not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
    }
	}
  } catch (error) {
	  res.status(404);
      return res.json({
        success: false,
        message: " title already exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
   next(error);
  }
};
exports.getRole = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Role.findById(id);
    //console.log(result);
	if (result !== undefined && result !== null) {
      return res.json({
        success: true,
        message: "Role data",
        data: result,
      });
  }else{
	  res.status(404);
      return res.json({
        success: false,
        message: "role id not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
  }
  }catch (error) {
	   res.status(404);
      return res.json({
        success: false,
        message: "role id does not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
  }
};