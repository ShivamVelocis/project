const {validateToken, decodeToken, generaterefreshToken,} = require("../users/utils/auth");
const userModel = require("../users/models/userModel");
const CONFIG = require("../configs/config");




// validates if user is admin or not
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let user = decodeToken(req.session.token);
      let userRole = await userModel.findOne({ _id: user.userId });
      req.session.token = await generaterefreshToken(req.session.token);
      if (userRole.role_id == 1) next();
      else {
        req.flash("error", CONFIG.NOT_AUTHORIZED);
        return res.redirect("/user/auth/login");
      }
    } else {
      res.redirect("/user/auth/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", error);
    res.redirect("/user/auth/login");
  }
};
