const CONFIG = require("./../configs/config");
const { paginateFiles } = require("../utils/paginateImages");
const imageModel = require("../models/galleryModel");

const addImages = (req, res, next) => {
  res.render("gallery/views/add", {
    module_title: "Gallery",
    title: "Add images",
  });
};

const postAddImages = async (req, res, next) => {
  let image_status = req.body.img_status;
  try {
    let images = req.files.map((image) => {
      return {
        image_name: image.filename,
        image_status: image_status,
        image_path: image.destination,
        image_size: image.size,
        image_type: image.mimetype.split("/")[1],
      };
    });
    await imageModel.insertMany(images);
    res.send("ok tested");
  } catch (error) {
    console.log(error);
  }
};
const listImages = async (req, res, next) => {
  try {
    let imagesData = await paginateFiles(1, 10);
    res.render("gallery/views/list", { images: imagesData });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addImages, postAddImages, listImages };
