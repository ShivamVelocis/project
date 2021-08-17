const Contactus = require("../models/contactusModels.js");
const Configs = require("../configs/config");
const { check, validationResult } = require("express-validator");

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
        success: true,
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
        success: true,
        message: "Contactus data",
        data: result,
      });
    }else{
		 res.status(404);
      return res.json({
        success: false,
        message: "contact us id not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
	}
  } catch (error) {
	   res.status(404);
      return res.json({
        success: false,
        message: "contact us id does not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
    //console.log(error);
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
    } else {
      let resultdata = await Contactus.find({});
      return res.json({
        success: true,
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
    } else {
      let result = await Contactus.findOneAndRemove({ _id: id });
	   if (result !== undefined && result !== null) {
      return res.json({
        success: true,
        message: "Contactus deleted successfully",
      });
	   }else{
		    res.status(404);
            return res.json({
             success: false,
            message: "contact us id does not exist in database",
            data: [],
           accesstoken: req.accesstoken,
      });
	   }
    }
  } catch (error) {
	  res.status(404);
            return res.json({
             success: false,
            message: "contact us id not exist in database",
            data: [],
           accesstoken: req.accesstoken,
      });
    console.log(error);
  }
};

exports.updateContactus = async (req, res) => {

 let id = req.body.id;
  let updatedContactus = req.body;
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
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "contact us updtaed successfully",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: "contact us id does not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
    }
	}
  } catch (error) {
	  res.status(404);
      return res.json({
        success: false,
        message: "title already exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
   //next(error);
  } 
   
};
