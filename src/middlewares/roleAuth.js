const {
  validateToken,
  decodeToken,
  generaterefreshToken,
} = require("../utils/authHelper");
const userModel = require("../users/models/userModel");

exports.adminRole = async (req, res, next) => {
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let { id } = decodeToken(req.session.token);
      let userRole = await userModel.findOne({ _id: id });
      console.log(userRole, id);
      req.session.token = await generaterefreshToken(req.session.token);
      if (userRole.role_id == 1) next();
      else {
        req.flash("error", "Not authorized to access this resource");
        return res.redirect("/user/auth/login");
      }
    } else {
      res.redirect("/user/auth/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/user/auth/login");
  }
};
