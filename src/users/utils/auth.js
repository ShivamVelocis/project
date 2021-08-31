const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");

/**
 * Generate JWT Token.
 * @param {Object} payload User data .
 * @param {string} secretKey key to encode token.
 * @param {string} expiresTime Expire time in seconds.
 * @return {string} return access token.
 */
const generateJWTToken = async (payload, secretKey, expiresTime) => {
  //
  let token = await jwt.sign(payload, `${secretKey}`, {
    expiresIn: Number(expiresTime),
  });
  return token;
};

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

/**
 * Generate new token for user so user remained logged in
 * @param {string} token JWT token.
 * @return {string} return new token.
 */
const generaterefreshToken = async (token) => {
  let user = decodeToken(token);
  let refreshtoken = await generateJWTToken(
    user,
    process.env.ACCESS_TOKEN_SECRET,
    process.env.REFRESH_TOKEN_LIFE
  );
  return refreshtoken;
};

/**
 * Extract token from request header
 * @param {Object} req http(s) request object.
 * @return {String} Return JWT token if token present in request header.
 */
const extractToken = (req) => {
  try {
    if (!req.headers.authorization) {
      return false;
    }
    const accesstoken = req.headers.authorization.split(" ")[1];
    if (accesstoken === null) {
      return false;
    }
    return accesstoken;
  } catch (err) {
    return false;
  }
};
module.exports = {
  validateToken,
  decodeToken,
  generaterefreshToken,
  generateJWTToken,
  extractToken,
};
