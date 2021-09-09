const multer = require("multer");
const CONFIG = require("../configs/config");

// multer middleware parse request and validate request
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: {
    fileSize: 1024 * 1024,
  },
}).single("file");

// wrapper middleware to handle error thrown by multer
let uploadProfilePicture = (req, res, next) => {
  upload(req, res, (error) => {
	  console.log(error);
    if (error) {
      res.status(400);
      return res.json({
        success: false,
        message:
          error.message == "File too large"
            ? CONFIG.TOO_LARGE_IMAGE
            : error.message,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return next();
  });
};

module.exports = { uploadProfilePicture };

