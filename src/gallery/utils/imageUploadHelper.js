const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/files/gallery");
  },

  filename: function (req, file, cb) {
    console.log(file.originalname.replace(/\.[^/.]+$/, ""))
    let randomnumber = Math.floor(Math.random() * 10);
    cb(
      null,
      file.originalname.replace(/\.[^/.]+$/, "") +
        "-" +
        Date.now() +
        "-" +
        randomnumber +
        path.extname(file.originalname)
    );
  },
});
let limits = { fileSize: 1 * 1024 * 1024 };
let fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    const err = new Error("Only .png, .jpg and .jpeg format allowed!");
    err.name = "ExtensionError";
    return cb(err);
  }
};

let upload = multer({ storage, limits, fileFilter }).array(
  "uploadedImages",
  10
);

module.exports = { upload };
