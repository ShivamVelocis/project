
















const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;

let textFieldPattern = /^[ A-Za-z0-9_.\/,]*$/;
let textAreaPattern = /^[ A-Za-z0-9_.\/,<>]*$/;

// content request body validater
const userValidationRules = () => {
  return [
    body("username").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Username should not be empty");
      }
      if (value.match(textFieldPattern) == null) {
        throw new Error("Some special characters are not allowed");
      }
      return true;
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
  return res.status(422).render("ErrorPage", { error: extractedErrors });


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
