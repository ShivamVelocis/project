const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");

const addACLRuleValidation = () => {
  return [
    body("allowedResources")
      .isArray()
      .withMessage("allowedResources should be a array"),
    body("allowedResources.*.path").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Resource path should not be empty");
      }
      return true;
    }),
    body("allowedResources.*.methods")
      .isIn(["GET", "POST", "PUT", "DELETE"])
      .withMessage("Methods should be valid http methods"),
    body("denyResources")
      .isArray()
      .withMessage("denyResources should be a array"),
    body("denyResources.*.path").custom((value, { req }) => {
      if (value == "") {
        throw new Error("Resource path should not be empty");
      }
      return true;
    }),
    body("denyResources.*.methods")
      .isIn(["GET", "POST", "PUT", "DELETE"])
      .withMessage("Methods should be valid http methods"),
    body("role").exists().withMessage(CONFIG.EMPTY_STATUS),
  ];
};

// middleware to check if any error encouter during validation
const isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  if (extractedErrors) {
    return res.json({ status: false, message: extractedErrors, data: null });
  }
  next();
};

module.exports = { addACLRuleValidation, isRequestValid };
