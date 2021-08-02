const Contactus = require("../models/contactusModels.js");
const Configs = require("../configs/config");
const { check, validationResult } = require('express-validator');

exports.addContactus = async (req, res) => {
	
	
	try {
	 var form_data = {
      title: req.body.title,
      description: req.body.description,
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
      let contactus = new Contactus(form_data);
      let saveContent = await contactus.save();
      return res.json({
		       success:"Success",
               message: "Contactus added successfully",
              data: saveContent,
			  
      });
    }

  } catch (error) {
     console.log(error);
  }
};

exports.getContactus = async (req, res) => {
	
	let id = req.params.id;
  try {
    let result = await Contactus.findById(id);
    //console.log(result);
	if (result !== undefined && result !== null) {
      return res.json({
        success: "Success",
        message: "Contactus data",
        data: result,
      });
  }
  }catch (error) {
    console.log(error);
  }
	
};

exports.getAllcontactus = async (req, res) => {
	
	
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
    let resultdata = await Contactus.find({});
	return res.json({
        success: "success",
        message: "All Contactus fetch successfully",
        data: resultdata,
      });
  }
  
  } catch (error) {
         console.log(error);
    }
};

exports.removeContactus = async (req, res) => {
	
  let id = req.params.id;
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
		 let result = await Contactus.findOneAndRemove({ _id: id });
		 return res.json({
		       success:"Success",
               message: "Contactus deleted successfully", 
      });
	}
  } catch (error) {
	  console.log(error);
  }
	
};

exports.contactusToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Contactus.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContactUs/views/updateContactus", {
        oldCont: result,
      });
    }
  } catch (error) {
    res.render("ContactUs/views/ErrorPage", {
      error: Configs.FETCH_CONTENT_ERROR,
    });
  }
};

exports.updateContactus = async (req, res) => {
	let id = req.params.id;
  let updatedContactus = {
      title: req.body.title,
      description: req.body.description,
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
    let result = await Contactus.findOneAndUpdate(
      { _id: id },
      { $set: updatedContactus },
      { new: true, upsert: true }
    );
	return res.json({
		       success:"Success",
               message: "Contactus updated successfully",
			  
      });
	}
  
  }catch (error) {
    console.log(error);
  }
	
};
