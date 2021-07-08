const sharp = require("sharp");

genrateThumbnails = async (filePath, fileName) => {
  await sharp(`${filePath}/${fileName}`)
    .resize(200, 200)
    .toFile(
      "./public/files/gallery/" + "thumbnails/" + "thumbnail_" + fileName
    );
};

module.exports = { genrateThumbnails };
