const {
  isUserTokenValid,
  decodeToken,
  generaterefreshToken,
} = require("../Utils/authHelper");

let assignRole = async (req, res, next) => {
  try {
    if (isUserTokenValid(req)) {
      let payload = decodeToken(req.headers.authorization.split(" ")[1]);
      if (!payload.userRole) {
        res.locals.userRole = "anonymous";
        return next();
      }
      req.accesstoken = await generaterefreshToken(
        req.headers.authorization.split(" ")[1]
      );
      console.log(payload);
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
