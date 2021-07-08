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


exports.roleAuthv1 = (userRole) => {
  isAuthenticated = async (req, res, next) => {
    try {
      if (req.session && req.session.token && validateToken(req.session.token)) {
        let user = decodeToken(req.session.token);
        let userData = await userModel.findOne({ _id: user.userId });
        req.session.token = await generaterefreshToken(req.session.token);

        // user can access own data
        let userId = req.params.id;
        if (user.userId == userId) return next() 

        // admin can access any data
        let adminrole = await roldeModel.findOne({ title:process.env.ADMIN_TITLE });
        if(userData.role_id == adminrole._id) return next()

        // access for user with pass role in route 
        let role = await roldeModel.findOne({ title: userRole });
        if (userData.role_id == role._id) return next();
        // when user not authorized
        else {
          req.flash("error", CONFIG.NOT_AUTHORIZED);
          return res.redirect("/user/auth/login");
        }
      } else {
        // when user dont have valid token
        res.redirect("/user/auth/login");
      }
    } catch (error) {
      // unknown error encounter
      console.error(error);
      req.flash("error", error);
      res.redirect("/user/auth/login");
    }
  };

  return isAuthenticated;
};

