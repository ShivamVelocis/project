const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require('../configs/config');

// add new user request body validater
exports.addUserValidationRules = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .isEmail()
      .withMessage("Please enter valid email"),

    body("password")
      .exists()
      .withMessage(CONFIG.INVALID_PASSWORD)
      .bail()
      .custom((value, { req }) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_PASSWORD);
        }
        if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_PASSWORD);
        }
        return true;
      }),

    body("role_id")
      .exists()
      .withMessage(CONFIG.INVALID_ROLE)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_ROLE);
      }),

    body("username")
      .exists()
      .withMessage(CONFIG.EMPTY_USER_NAME)
      .bail()
      .custom((value, { req }) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_USER_NAME );
        }
        if (value.match(CONFIG.TITLE_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_USER_NAME);
        }
        return true;
      }),

    body("user_status")
      .exists()
      .withMessage(CONFIG.INVALID_STATUS)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_STATUS);
      }),
  ];
};

// updating user request body validater
exports.updateUserValidationRules = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .isEmail()
      .withMessage("Please enter valid email"),

    body("role_id")
      .exists()
      .withMessage(CONFIG.INVALID_ROLE)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_ROLE);
      }),

    body("user_status")
      .exists()
      .withMessage(CONFIG.INVALID_STATUS)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_STATUS);
      }),
  ];
};

// mongodb id validater for get request
exports.mongoIDValidationRules = () => {
  return param("id")
    .exists()
    .withMessage(CONFIG.INVALID_MONGO_ID)
    .bail()
    .custom((value) => {
      // console.log(value);
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGO_ID);
      }
      return true;
    });
};

// middleware to check if any error encouter during validation
exports.isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // console.log(errors)
  errors.array().map((err) => extractedErrors.push(err.msg));
  res.locals.validationError =
    extractedErrors.length > 0 ? extractedErrors : null;
  next();
};
