const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
exports.genrateJWTToken = async (userId, secretKey, expiresTime) => {
  console.log(secretKey, expiresTime);
  let token = await jwt.sign(
    {
      userId: userId,
    },
    `${secretKey}`,
    {
      expiresIn: Number(expiresTime),
    }
  );
  return token;
};

exports.validateToken = (token) => {
  try {
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // console.log(error);
    return false;
  }
};

exports.decodeToken = (token) => {
  let userData = jwt_decode(token);
  return userData;
};
