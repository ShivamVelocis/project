const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

const validateToken = (token) => {
  try {
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const genrateJWTToken = async (userId, secretKey, expiresTime) => {
  // console.log(secretKey, expiresTime);
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

module.exports = {
  validateToken,
  decodeToken,
  generaterefreshToken,
};
