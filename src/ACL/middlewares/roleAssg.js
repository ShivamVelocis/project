const { isUserTokenValid, decodeToken, generaterefreshToken } = require("../Utils/authHelper");
const roleModel = require("../../roleManagement/models/rolemodel");


let assignRole = async (req, res, next) => {
  try {
    if (isUserTokenValid(req)) {
      let payload = decodeToken(req.headers.authorization.split(" ")[1]);
      // let dbUserRole = await roleModel.findOne({ _id: payload.userRole });
      if (!payload.userRole) {
        res.locals.userRole = "anonymous";
        return next();
      }
      req.accesstoken = await generaterefreshToken(
        req.headers.authorization.split(" ")[1]
      );
      res.locals.userRole = payload.userRole;
      return next();
    } else {
      console.log("Anonymous user");
      res.locals.userRole = "anonymous";
      return next();
    }
  } catch (error) {
    console.log(error);
    res.locals.userRole = "anonymous";
    return next();
  }
};

module.exports = { assignRole };
