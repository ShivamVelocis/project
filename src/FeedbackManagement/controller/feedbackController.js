const Feedback = require("../models/feedbackModels.js");
const Configs = require("../configs/config");
const { check, validationResult } = require('express-validator');


exports.addFeedback = async (req, res) => {
	
		try {
	 var form_data = {
      title: req.body.title,
	  email:req.body.email,
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
      let feedback = new Feedback(form_data);
      let saveFeedback = await feedback.save();
      return res.json({
		       success:"Success",
               message: "Feedback added successfully",
              data: saveFeedback,
			  
      });
    }

  } catch (error) {
	  return res.json({
		       success:"Success",
               message: "title and user name already exist in database",
			  
      });
     console.log(error);
  }
	
};

exports.getFeedback = async (req, res) => {
	let id = req.params.id;
  try {
    let result = await Feedback.findById(id);
	if (result !== undefined && result !== null) {
      return res.json({
        success: "Success",
        message: "Feedback data",
        data: result,
      });
  }
  }catch (error) {
    console.log(error);
  }
};

exports.getAllFeedback = async (req, res) => {
	
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
    let resultdata = await Feedback.find({});
	return res.json({
        success: "success",
        message: "All Feedback fetch successfully",
        data: resultdata,
      });
  }
  
  } catch (error) {
         console.log(error);
    }
};

exports.removeFeedback = async (req, res) => {
	
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
		 let result = await Feedback.findOneAndRemove({ _id: id });
		 console.log(result);
		 	if (result !== undefined && result !== null) {
		 return res.json({
		       success:"Success",
               message: "Feedback deleted successfully", 
                  });
			}else{
				return res.json({
		       success:"Success",
               message: "Feedback id does not exist in database", 
                  });
			}
	}
  } catch (error) {
	  console.log(error);
  }
	

};

exports.updateFeedback = async (req, res,next) => {
   let id = req.body.id;
  let updatedFeedback = req.body;
  try {
    let result = await Feedback.findOneAndUpdate(
      { _id: id },
      { $set: updatedFeedback },
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "feedback updated succeessfully",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: "feedback id does not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
	  res.status(404);
      return res.json({
        success: false,
        message: "feedback id does not exist in database",
        data: [],
        accesstoken: req.accesstoken,
      });
    //next(error);
  }
	
};
