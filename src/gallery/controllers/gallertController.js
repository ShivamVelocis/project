const CONFIG = require("./../configs/config");
const { paginateFiles } = require("../utils/paginateImages");
const imageModel = require("../models/galleryModel");
const { genrateThumbnails } = require("../utils/thumbnailGenrat");

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
      genrateThumbnails(image.destination, image.filename);
      return {
        image_name: image.filename,
        image_status: image_status,
        image_path: image.destination,
        image_size: image.size,
        image_type: image.mimetype.split("/")[1],
        image_original_name: image.originalname,
        thumbnail: {
          thumbnail_name: image.originalname,
          thumbnail_status: image_status,
          thumbnail_path: image.destination + "/thumbnails/",
          thumbnail_type: image.mimetype.split("/")[1],
        },
      };
    });
    await imageModel.insertMany(images);
    return res.redirect("/gallery/list");
  } catch (error) {
    console.error(error);
  }
};
const listImages = async (req, res, next) => {
  let { page, limit } = req.query;
  try {
    let imagesData = await paginateFiles(page, limit);
    res.render("gallery/views/list", { images: imagesData });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addImages, postAddImages, listImages };
