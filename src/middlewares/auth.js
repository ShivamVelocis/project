const {
  validateToken,
  decodeToken,
  generaterefreshToken,
} = require("../utils/authHelper");

exports.validateUser = async (req, res, next) => {
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      res.locals.user = decodeToken(req.session.token);
      req.session.token = await generaterefreshToken(req.session.token);
      next();
    } else {
      res.redirect("/user/auth/login");
    }
  } catch (error) {
    console.error(error);
    res.redirect("/user/auth/login");
  }
};
