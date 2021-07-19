const { validateToken, decodeToken } = require("../../utils/authHelper");
const userModel = require("../../users/models/userModel");
const roleModel = require("../../roleManagement/models/rolemodel");
let roleAssignment = async (req, res, next) => {
  // console.log(req.originalUrl)
  // console.log(req.method)
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let tokenUser = decodeToken(req.session.token);
      let dbUser = await userModel.findOne({ _id: tokenUser.id });
      if (!dbUser) {
        res.locals.userRole = "anonymous";
        return next();
      }
      let dbUserRole = await roleModel.findOne({ _id: dbUser.role_id });
      if (!dbUserRole) {
        res.locals.userRole = "anonymous";
        return next();
      }
      res.locals.userRole = dbUserRole.title;
      return next();
    } else {
      console.log("anonymous");
      res.locals.userRole = "anonymous";
      return next();
    }
  } catch (error) {
    console.log(error.message);
    res.locals.userRole = "anonymous";
    req.flash("error", error.message);
    res.redirect("/user/auth/login");
  }
};

module.exports = { roleAssignment };
