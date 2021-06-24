const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const genrateJWTToken = async (userId, secretKey, expiresTime) => {
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

const validateToken = (token) => {
  try {
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // console.log(error);
    return false;
  }
};
const decodeToken = (token) => {
  return (userData = jwt_decode(token));
  // return { id: userData.userId };
};

const generaterefreshToken = async (token) => {
  let user= decodeToken(token);
  let refreshtoken = await genrateJWTToken(
    user.userId,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.ACCESS_TOKEN_LIFE
  );
  return refreshtoken;
};

module.exports = {
  validateToken,
  decodeToken,
  generaterefreshToken,
  genrateJWTToken
};
