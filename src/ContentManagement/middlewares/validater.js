const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;


const CONFIG = require("../configs/config");

// content request body validater
const contentValidationRules = () => {
  return [
    body("title")
      .exists()
      .withMessage(CONFIG.EMPTY_TITLE)
      .bail()
      .custom((value, { req }) => {
        // console.log("tile", value);
        if (value == "") {
          throw new Error(CONFIG.EMPTY_TITLE);
        }
        if (value.match(CONFIG.TITLE_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_TITLE);
        }
        return true;
      }),
    body("description")
      .exists()
      .withMessage(CONFIG.EMPTY_DESCRIPTION)
      .bail()
      .custom((value, { req }) => {
        // console.log("des", value);
        if (value == "") {
          throw new Error(CONFIG.EMPTY_DESCRIPTION);
        }
        if (value && value.match(CONFIG.TEXTAREA_PATTERN == null)) {
          // console.log(value);
          throw new Error(CONFIG.INVALID_DESCRIPTION);
        }
        return true;
      }),
    body("content_status")
      .exists()
      .withMessage(CONFIG.EMPTY_STATUS)
      .bail()
      .custom((value, { req }) => {
        if (value && (value == 1 || value == 2)) {
          return true;
        }
        throw new Error(CONFIG.INVALID_STATUS);
      }),
  ];
};

// mongodb id validater for get request
const mongoIDValidationRules = () => {
  return param("id").custom((value) => {
    if (!ObjectId(value)) {
      throw new Error("Please enter valid  MongoDB ID");
    }
    return true;
  });
};

// middleware to check if any error encouter during validation
const isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));
  res.locals.validationError =
    extractedErrors.length > 0 ? extractedErrors : null;
  next();
};

module.exports = {
  contentValidationRules,
  mongoIDValidationRules,
  isRequestValid,
};
