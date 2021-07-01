const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallertController");
const {uploadImages} = require('../utils/imageUploadHelper')



router.get("/add", galleryController.addImages); //render add user page 
router.post("/add", uploadImages,galleryController.postAddImages)
router.get("/list",galleryController.listImages)

module.exports = router;
