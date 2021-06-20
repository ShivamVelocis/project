const jwt = require("jsonwebtoken");

exports.genrateJWTToken = async (userId, secretKey, expiresTime) => {
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
