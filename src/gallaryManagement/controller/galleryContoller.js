const Gallery = require("../models/gallerymodel.js");

const CONFIG = require("../configs/config");
const { check, validationResult } = require('express-validator');
const sharp = require("sharp");

//Upload user profile picture in binary formate
const uploadgalleryPicture = async (req, res, next) => {
  if (req.file && req.file.buffer) {
    try {
      let file = await sharp(req.file.buffer)
        .resize(200, 200)
        .png({ quality: 100 })
        .toBuffer();
	  formdata={
		  file:file,
		  file_type:req.body.file_type
		  
	  }
	  let gallery = new Gallery(formdata);
      let saveGallery = await gallery.save();
      return res.json({
		       success:true,
               message: "Gallery added successfully",
              data: saveGallery,
			  
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

//upload image and video in folder
const uploadprofileinfolder = async (req, res, next) => {
if (req.file && req.file.filename) {
 try {
	  formdata={
		  file:req.file.filename,
		  file_type:req.body.file_type
	  }
	  console.log(formdata);
	  let gallery = new Gallery(formdata);
      let saveGallery = await gallery.save();
	  //console.log(saveGallery);
      return res.json({
		       success:true,
               message: "Gallery added successfully",
              data: saveGallery,
			  
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


//get all galary image
const getallgalleryimage = async (req, res, next) => {
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
          let resultdata = await Gallery.find({});
		  console.log(resultdata);
	       return res.json({
                   success: "success",
              message: "All Gallery fetch successfully",
              data: resultdata,
            });
         }
  
               } catch (error) {
                    console.log(error);
             }
};

const getgalleryimageview = async (req, res, next) => {
     	let id = req.params.id;
       try {
              let result = await Gallery.findById(id);
	          if (result !== undefined && result !== null) {
          return res.json({
                      success: true,
                      message: "Gallery data",
                      data: result,
                   });
              }else{
	              return res.json({
                  success: false,
                  message: "Gallery id does not exist in database",
                });
             }
           }catch (error) {
               console.log(error);
             }
};

const deletegalleryimage = async (req, res, next) => {
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
		 let result = await Gallery.findOneAndRemove({ _id: id });
		 	if (result !== undefined && result !== null) {
		 return res.json({
		       success:true,
               message: "Gallery deleted successfully", 
                  });
			}else{
				return res.json({
		       success:false,
               message: "Gallery id does not exist in database", 
                  });
			}
	}
  } catch (error) {
	  //console.log(error);
  }
};




//Update exist user
const updategalleryimage = async (req, res, next) => {
   let id = req.body.id;
  if (req.file && req.file.buffer) {
	  console.log(req);
    try {
      let file = await sharp(req.file.buffer)
        .resize(200, 200)
        .png({ quality: 100 })
        .toBuffer();
		 formdata={
		  file:file,
		  file_type:req.body.file_type 
	  }
     let result = await Gallery.findOneAndUpdate(
      { _id: id },
      { $set: formdata },
      { new: true }
    );
	
      res.status(200);
      return res.json({
        success: true,
        message: "Gallery updated successfully",
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










module.exports = {
  uploadgalleryPicture,
  uploadprofileinfolder,
  getallgalleryimage,
  getgalleryimageview,
  deletegalleryimage,
  updategalleryimage,
};