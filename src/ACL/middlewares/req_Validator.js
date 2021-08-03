const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;

const addACLRuleValidation = () => {
  return [
    body("allowedResources")
      .optional()
      .isArray()
      .withMessage("allowedResources should be a array"),
    body("allowedResources.*")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("denyResources")
      .optional()
      .isArray()
      .withMessage("denyResources should be a array"),
    body("denyResources")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("role").isString().withMessage("Role should not be empty"),
  ];
};
const updateACLRuleValidation = () => {
  return [
    body("allowedResources")
      .optional()
      .isArray()
      .withMessage("allowedResources should be a array"),
    body("allowedResources.*")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("denyResources")
      .optional()
      .isArray()
      .withMessage("denyResources should be a array"),
    body("denyResources")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("role").optional().isString().withMessage("Role should not be empty"),
    body("id")
      .exists()
      .withMessage("id should not be empty")
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
  ];
};

const deleteACLRuleValidation = () => {
  return [
    body("id")
      .exists()
      .withMessage("id is required")
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
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
    res.status(400);
    return res.json({ success: false, message: extractedErrors, data: null });
  }
  next();
};

module.exports = {
  addACLRuleValidation,
  updateACLRuleValidation,
  deleteACLRuleValidation,
  isRequestValid,
};
