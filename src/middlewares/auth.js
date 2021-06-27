const CONFIG = require("../configs/config");
const {validateToken, decodeToken, generaterefreshToken} = require("../users/utils/auth");




// middleware to allow logged users and refresh tokens
exports.isUserLoggedIn = async (req, res, next) => {
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      res.locals.user = decodeToken(req.session.token);
      req.session.token = await generaterefreshToken(req.session.token);
      next();
    } else {
      req.flash("error",CONFIG.LOGIN_FIRST_MESSAGE);
      res.redirect("/user/auth/login");
    }
  } catch (error) {
    console.error(error);
    req.flash("error",CONFIG.LOGIN_FIRST_MESSAGE);
    res.redirect("/user/auth/login");
  }
};



// check wheather user is loged in or not 
exports.loginCheck = async (req, res, next) => {
  res.locals.isAuth = true;
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      res.locals.isAuth = true;
      next();
    } else {
      res.locals.isAuth = false;
      next();
    }
  } catch (error) {
    console.error(error);
    res.locals.isAuth = false;
    next();
  }
};
