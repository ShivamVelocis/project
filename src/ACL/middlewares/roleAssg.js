const {
  isUserTokenValid,
  decodeToken,
  generaterefreshToken,
} = require("../Utils/authHelper");

let assignRole = async (req, _res, next) => {
  try {
    if (isUserTokenValid(req)) {
      let payload = decodeToken(req.headers.authorization.split(" ")[1]);
      if (!payload.userRole) {
        req.userRole = "anonymous";
        return next();
      }
      req.accesstoken = await generaterefreshToken(
        req.headers.authorization.split(" ")[1]
      );
      req.userRole = payload.userRole;
      return next();
    } else {
      console.log("Anonymous user");
      req.userRole = "anonymous";
      return next();
    }
  } catch (error) {
    req.userRole = "anonymous";
    return next();
  }
};

module.exports = { assignRole };
