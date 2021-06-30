const sharp = require("sharp");

genrateThumbnails = async (filePath, fileName) => {
  await sharp(`${filePath}/${fileName}`)
    .resize(200, 200)
    .toFile("./public/files/gallery/" + "thumbnails/" + fileName);
};

module.exports = { genrateThumbnails };
