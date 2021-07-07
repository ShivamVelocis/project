const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require("../configs/config");

// login request body validater

exports.emailValidator = () => {
  return body("email").custom((value, { req }) => {
    if (value == "") {
      throw new Error("Email should not be empty");
    }
    if (value.match(CONFIG.EMAIL_PATTERN) == null) {
      throw new Error("Please enter valid email only");
    }
    return true;
  });
};

exports.passwordValidator = () => {
  return body("password").custom((value, { req }) => {
    if (value == "") {
      throw new Error("Password should not be empty");
    }
    if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
      throw new Error("Please enter alphanumeric password only");
    }
    return true;
  });
};

exports.roleValidator = () => {
  return body("role_id").custom((value, { req }) => {
    // console.log("role_id", value);
    if (value == 1 || value == 2) {
      return true;
    }
    throw new Error("Please selecte role");
  });
};

exports.userNameValidator = () => {
  return body("username").custom((value, { req }) => {
    // console.log("username", value);
    if (value == "") {
      throw new Error("User Name should not be empty");
    }
    if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
      throw new Error("User Name enter alphanumeric password only");
    }
    return true;
  });
};

exports.userStatusValidator = () => {
  return body("user_status").custom((value, { req }) => {
    // console.log("Status", value);
    if (value == 1 || value == 2) {
      return true;
    }
    throw new Error("Please selecte status");
  });
};


// mongodb id validater for get request
exports.mongoIDValidator = () => {
  return param("id").custom((value) => {
    if (!ObjectId(value)) {
      throw new Error("Please enter valid  MongoDB ID");
    }
    return true;
  });
};

// middleware to check if any error encouter during validation
exports.validate = (req, res, next) => {
  // console.log(req.originalUrl);
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  // beautify the error object
  //   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  // console.log(extractedErrors);
  req.flash("error", extractedErrors);
  res.status(422);
  return res.redirect(req.originalUrl);
};
