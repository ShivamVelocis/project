const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

exports.validateUser = async (req, res, next) => {
  try {
    if (req.cookies && req.cookies.token && validateToken(req.cookies.token)) {
      console.log(req.cookies.token);
      res.locals.user = decodeToken(req.cookies.token);
      next();
    } else {
      res.redirect("/user/auth/login");
      // res.render("views/error/ErrorPage", {
      //   error: "You not authorised to access this resource",
      // });
    }
  } catch (error) {
    res.redirect("/user/auth/login");
    // res.render("views/error/ErrorPage", {
    //   error: "You not authorised to access this resource",
    // });
  }
};

const validateToken = (token) => {
  try {
    console.log("token verify");
    console.log(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET));
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const decodeToken = (token) => {
  let userData = jwt_decode(token);
  // console.log(userData);
  return { id: userData.userId };
};
