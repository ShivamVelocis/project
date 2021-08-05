const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

// generate JWT token
/**
 * check resource user want to access.
 * @param {Object} payload User data .
 * @param {string} secretKey key to encode token.
 * @param {string} expiresTime Expire time in seconds.
 * @return {string} return access token.
 */
const generateJWTToken = async (payload, secretKey, expiresTime) => {
  // console.log(payload, secretKey, expiresTime);
  let token = await jwt.sign(payload, `${secretKey}`, {
    expiresIn: Number(expiresTime),
  });
  return token;
};

// validates token provided by user
/**
 * Check wheather token is valid or not
 * @param {string} token JWT token.
 * @return {boolean} return boolean.
 */
const validateToken = (token) => {
  try {
    return !!jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return false;
  }
};

//extract user data from token for later use
/**
 * Check wheather token is valid or not
 * @param {string} token JWT token.
 * @return {object} return user data object.
 */
const decodeToken = (token) => {
  userData = jwt_decode(token);
  delete userData.iat;
  delete userData.exp;
  return userData;
  // return { id: userData.userId };
};

// generate new token for user so user remained logged in
/**
 * @param {string} token JWT token.
 * @return {string} return new token.
 */
const generaterefreshToken = async (token) => {
  let user = decodeToken(token);
  // console.log(user)
  let refreshtoken = await generateJWTToken(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE
  );
  return refreshtoken;
};

module.exports = {
  validateToken,
  decodeToken,
  generaterefreshToken,
  generateJWTToken,
};
