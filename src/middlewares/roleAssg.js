const {validateToken, decodeToken} = require("../utils/authHelper");
const userModel =  require("../users/models/userModel")
const roldeModel = require('../roleManagement/models/rolemodel')
let roleAssignment = async (req, res, next) => {
  // console.log(req.originalUrl)
  // console.log(req.method)
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let tokenUser = decodeToken(req.session.token);
      // console.log(tokenUser);
      let dbUser = await userModel.findOne({ _id: tokenUser.id });
      // console.log(dbUser.role_id);
      let dbUserRole = await roldeModel.findOne({ _id: dbUser.role_id });
      // console.log(dbUserRole);
      res.locals.userRole = dbUserRole.title;
      return next();
    } else {
      console.log("Guest User");
      res.locals.userRole = "guest";
      return next();
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", error.message);
    res.redirect("/user/auth/login");
  }
};

module.exports = { roleAssignment };
