const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require("../../configs/config");

// content request body validater
const contentValidationRules = () => {
  return [
    body("title").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Title should not be empty");
      }
      if (value.match(CONFIG.TITLE_PATTERN) == null) {
        throw new Error("Please enter alphanumeric title only");
      }
      return true;
    }),
    body("description").custom((value, { req }) => {
      
      if (value == "") {
        throw new Error("Description should not be empty");
      }
      if (value.match(CONFIG.TEXTAREA_PATTERN == null)) {
        console.log(value)
        throw new Error("Please enter alphanumeric description only");
      }
      return true;
    }),
    body("content_status").custom((value, { req }) => {
      console.log(value)
      if (value == 1 || value == 2) {
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
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  //   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  //   console.log({ error: extractedErrors });
  // return res.status(422).render("ErrorPage", { error: extractedErrors });
  res.locals.validationError =
    extractedErrors.length > 0 ? extractedErrors : null;
  next();
  //response for postmon
  //   return res.status(422).json({
  //     errors: extractedErrors,
  //   });
};

module.exports = {
  contentValidationRules,
  mongoIDValidationRules,
  validate,
};
