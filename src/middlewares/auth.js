const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { genrateJWTToken } = require("../users/utils/auth");

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

const validateToken = (token) => {
  try {
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const decodeToken = (token) => {
  let userData = jwt_decode(token);
  return { id: userData.userId };
};

const generaterefreshToken = async (token) => {
  let { id } = decodeToken(token);
  let refreshtoken = await genrateJWTToken(
    id,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_LIFE
  );
  return refreshtoken;
};
