const Role = require("../models/rolemodel.js");
const Configs = require("../configs/config");
const { check, validationResult } = require('express-validator');
exports.roleForm = (req, res) => {
  res.render("roleManagement/views/addRole", { error: null });
};

exports.addRole = async (req, res) => {
  try {
	 var form_data = {
      title: req.body.title,
      status: req.body.status,
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
		       success:"Success",
               message: "Role added successfully",
              data: saveRole,
			  
      });
    }

  } catch (error) {
     console.log(error);
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
        success: "success",
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
		 return res.json({
		       success:"Success",
               message: "Role deleted successfully", 
      });
	}
  } catch (error) {
	  console.log(error);
  }
};

exports.updateRole = async (req, res) => {
  //console.log(req.params.id);
  let id = req.params.id;
  let updatedRole = {
      title: req.body.title,
      status: req.body.status,
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
      { new: true, upsert: true }
    );
	return res.json({
		       success:"Success",
               message: "Role updated successfully",
			  
      });
	}
  
  }catch (error) {
    console.log(error);
  }
};
exports.getRole = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Role.findById(id);
    //console.log(result);
	if (result !== undefined && result !== null) {
      return res.json({
        success: "Success",
        message: "Role data",
        data: result,
      });
  }
  }catch (error) {
    console.log(error);
  }
};