const express = require("express");
const router = express.Router();
const gallerycontroller = require("../controller/galleryContoller");
const { uploadProfilePicture } = require("../utils/uploadHandler");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+file.originalname)
  }
})

const upload = multer({ storage: storage })

router.post('/profile',uploadProfilePicture,gallerycontroller.uploadgalleryPicture);//upload image in binary formate

router.post('/uploadprofileinfolder',upload.single("file"),gallerycontroller.uploadprofileinfolder);//upload image and video in folder

router.get('/galleryallimage',gallerycontroller.getallgalleryimage);//upload image and video in folder

router.get('/:id',gallerycontroller.getgalleryimageview);//view upload image and video in folder



router.delete("/:id", gallerycontroller.deletegalleryimage);


router.put("/updategalleryimage",uploadProfilePicture,gallerycontroller.updategalleryimage);


 


module.exports = router;
