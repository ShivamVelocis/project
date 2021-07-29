const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { isDate } = require("moment");

const isUserTokenValid = (req) => {
  try {
    if (!req.headers.authorization) {
      return false;
    }
    const token = req.headers.authorization.split(" ")[1];
    if (token === null) {
      return false;
    }
    let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!payload) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

//generate JWT token
const generateJWTToken = async (payload, secretKey, expiresTime) => {
  let token = await jwt.sign(payload, `${secretKey}`, {
    expiresIn: Number(expiresTime),
  });
  return token;
};

//decode JWT token and return decode data
const decodeToken = (token) => {
  let userData = jwt_decode(token);
  delete userData.iat;
  delete userData.exp
  return userData;
};

// generate refresh token for logged users.
const generaterefreshToken = async (token) => {
  let user = decodeToken(token);
  let refreshtoken = await generateJWTToken(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE
  );
  return refreshtoken;
};

module.exports = {
  isUserTokenValid,
  decodeToken,
  generaterefreshToken,
};
