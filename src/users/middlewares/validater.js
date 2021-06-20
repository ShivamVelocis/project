const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;

let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let passwordPattern = /^[ A-Za-z0-9_.\/,<>]*$/;

// login request body validater
exports.loginValidationRules = () => {
  return [
    body("email").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Email should not be empty");
      }
      if (value.match(emailPattern) == null) {
        throw new Error("Please enter valid email only");
      }
      return true;
    }),
    body("password").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Password should not be empty");
      }
      if (value.match(passwordPattern) == null) {
        throw new Error("Please enter alphanumeric password only");
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
      // console.log("password", value);
      if (value == "") {
        throw new Error("Password should not be empty");
      }
      if (value.match(passwordPattern) == null) {
        throw new Error("Please enter alphanumeric password only");
      }
      return true;
    }),
    body("role_id").custom((value, { req }) => {
      // console.log("role_id", value);
      if (value == 1 || value == 2) {
        return true;
      }
      throw new Error("Please selecte role");
    }),
    body("username").custom((value, { req }) => {
      // console.log("username", value);
      if (value == "") {
        throw new Error("User Name should not be empty");
      }
      if (value.match(passwordPattern) == null) {
        throw new Error("User Name enter alphanumeric password only");
      }
      return true;
    }),
    body("user_status").custom((value, { req }) => {
      // console.log("Status", value);
      if (value == 1 || value == 2) {
        return true;
      }
      throw new Error("Please selecte status");
    }),
  ];
};

// mongodb id validater for get request
exports.mongoIDValidationRules = () => {
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
