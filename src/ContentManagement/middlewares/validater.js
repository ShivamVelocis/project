const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;

const CONFIG = require("../configs/config");

// content request body validater
const addContentRules = () => {
  return [
    body("title")
      .exists()
      .withMessage(CONFIG.EMPTY_TITLE)
      .bail()
      .custom((value, { req }) => {
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
        if (value == "") {
          throw new Error(CONFIG.EMPTY_DESCRIPTION);
        }
        if (value.match(CONFIG.TEXTAREA_PATTERN == null)) {
          throw new Error(CONFIG.INVALID_DESCRIPTION);
        }
        return true;
      }),
    body("content_status")
      .exists()
      .withMessage(CONFIG.EMPTY_STATUS)
      .bail()
      .isIn([0, 1])
      .withMessage(CONFIG.INVALID_STATUS),
  ];
};

// content request body validater
const updateContentRule = () => {
  return [
    body("title")
      .optional()
      .custom((value) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_TITLE);
        }
        if (value.match(CONFIG.TITLE_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_TITLE);
        }
        return true;
      }),
    body("description")
      .optional()
      .custom((value) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_DESCRIPTION);
        }
        if (value && value.match(CONFIG.TEXTAREA_PATTERN == null)) {
          throw new Error(CONFIG.INVALID_DESCRIPTION);
        }
        return true;
      }),
    body("content_status")
      .optional()
      .isIn([0, 1, 2, 3, 4])
      .withMessage(CONFIG.INVALID_STATUS),
    body("id").custom((value) => {
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGO_ID);
      }
      return true;
    }),
  ];
};

const deleteContentRule = () => {
  return [
    body("id").custom((value) => {
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGO_ID);
      }
      return true;
    }),
  ];
};

const getContentRule = () => {
  return [
    param("id").custom((value) => {
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGO_ID);
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
  addContentRules,
  updateContentRule,
  deleteContentRule,
  getContentRule,
  isRequestValid,
};
