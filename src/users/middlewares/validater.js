const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require("../configs/config");

// login request body validater
exports.loginValidationRules = () => {
  return [
    body("email").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Email should not be empty");
      }
      if (value.match(CONFIG.EMAIL_PATTERN) == null) {
        throw new Error(CONFIG.INVALID_EMAIL);
      }
      return true;
    }),
    body("password").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Password should not be empty");
      }
      if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
        throw new Error(CONFIG.INVALID_PASSWORD);
      }
      return true;
    }),
  ];
};

// add new user request body validater
exports.addUserValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Please enter valid email"),
    body("password").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Password should not be empty");
      }
      if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
        throw new Error(CONFIG.INVALID_PASSWORD);
      }
      return true;
    }),
    body("role_id").custom((value, { req }) => {
      if (value == 1 || value == 2) {
        return true;
      }
      throw new Error(CONFIG.INVALID_ROLE);
    }),
    body("username").custom((value, { req }) => {
      if (value == "") {
        throw new Error("User Name should not be empty");
      }
      if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
        throw new Error(CONFIG.INVALID_USER_NAME);
      }
      return true;
    }),
    body("user_status").custom((value, { req }) => {
      if (value == 1 || value == 2) {
        return true;
      }
      throw new Error(CONFIG.INVALID_STATUS);
    }),
  ];
};

// mongodb id validater for get request
exports.mongoIDValidationRules = () => {
  return param("id").custom((value) => {
    if (!ObjectId(value)) {
      throw new Error(CONFIG.INVALID_MONGO_ID);
    }
    return true;
  });
};

// middleware to check if any error encouter during validation
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  // beautify the error object
  //   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  // req.flash("error", extractedErrors);
  // res.status(422);
  // return res.redirect(req.originalUrl);
  res.locals.validationError =
    extractedErrors.length > 0 ? extractedErrors : null;
  next();
};
