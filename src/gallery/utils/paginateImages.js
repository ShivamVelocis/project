const imageModel = require("../models/galleryModel");

let paginateFiles = async (page, limit) => {
  try {
    let imagesCount = await imageModel.countDocuments({});
    const result = {};
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    if (endIndex < imagesCount) {
      result.next = { page: page + 1, limit: limit };
    }
    if (startIndex > 0) {
      result.previous = { page: page - 1, limit: limit };
    }
    let imagesData = await imageModel
      .find()
      .sort("created_at")
      .skip(page)
      .limit(limit)
      .exec();
    result.results = imagesData;
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { paginateFiles };
