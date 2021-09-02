const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;

const addACLRuleValidation = () => {
  return [
    body("allowedResources")
      .optional()
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURCE),

    body("allowedResources.*")
      .optional()
      .custom((value) => {
        if (value && !ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),

    body("denyResources")
      .optional()
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURCE),

    body("denyResources.*")
      .optional()
      .custom((value) => {
        if (value && !ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
    body("role").isString().withMessage(CONFIG.INVALID_ROLE),

    body("children").optional().isArray().withMessage(CONFIG.INVALID_ROLE),
    body("children.*").isString().withMessage(CONFIG.INVALID_ROLE),

    body("parents").optional().isArray().withMessage(CONFIG.INVALID_ROLE),
    body("parents.*").isString().withMessage(CONFIG.INVALID_ROLE),
  ];
};
const updateACLRuleValidation = () => {
  return [
    body("allowedResources")
      .optional()
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURCE),
    body("allowedResources.*")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
    body("denyResources")
      .optional()
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURCE),
    body("denyResources")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
    body("role").optional().isString().withMessage(CONFIG.INVALID_ROLE),
    body("id")
      .exists()
      .withMessage("id should not be empty")
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
  ];
};

const deleteACLRuleValidation = () => {
  return [
    body("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
  ];
};

const getAclRuleValidation = () => {
  return [
    param("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
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
  getAclRuleValidation,
};
