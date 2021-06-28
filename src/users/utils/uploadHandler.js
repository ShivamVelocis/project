const multer = require("multer");

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
}).single("profilepic");

let uploadProfilePicture = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      console.log(error.message);
      req.flash("error", error.message);
      req.flash("oldUserData", "uploadfailed");
      return res.redirect(`/user/upload/profile/${req.params.id}`);
    }
    // req.flash("success", "Profile picture updated successfully");
    next();
  });
};

module.exports = { uploadProfilePicture };
