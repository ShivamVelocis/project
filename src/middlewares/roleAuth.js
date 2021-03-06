const {
  validateToken,
  decodeToken,
  generaterefreshToken,
} = require("../users/utils/auth");
const userModel = require("../users/models/userModel");
const roldeModel = require("../roleManagement/models/rolemodel");
const CONFIG = require("../configs/config");

// validates if user is admin or not
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let user = decodeToken(req.session.token);
      let userRole = await userModel.findOne({ _id: user.userId });
      req.session.token = await generaterefreshToken(req.session.token);
      let role = await roldeModel.findOne({ title: "admin" });
      if (userRole.role_id == role._id) next();
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

exports.roleAuth = (userRole) => {
  isAuthenticated = async (req, res, next) => {
    try {
      if (
        req.session &&
        req.session.token &&
        validateToken(req.session.token)
      ) {
        let user = decodeToken(req.session.token);
        let userData = await userModel.findOne({ _id: user.userId });
        req.session.token = await generaterefreshToken(req.session.token);
        let role = await roldeModel.findOne({ title: userRole });
        if (userData.role_id == role._id) next();
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

  return isAuthenticated;
};
