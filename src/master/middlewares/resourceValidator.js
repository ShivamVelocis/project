const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;

let resourceMethods = ["GET", "POST", "PUT", "DELETE"];

const addResource = () => {
  return [
    body("*.resource_name").exists().isString(),
    body("*.resource_path").exists().isString(),
    body("*.resource_status")
      .exists()
      .isIn([0, 1])
      .withMessage(CONFIG.INVALID_STATUS),
    body("*.module")
      .exists()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
    body("*.methods").exists().isArray(),
    body("*.methods.*")
      .isIn(["GET", "POST", "PUT", "DELETE"])
      .withMessage(CONFIG.INVALID_METHOD),
  ];
};
const updateResource = () => {
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
    body("resource_name").optional().isString(),
    body("resource_path").optional().isString(),
    body("resource_status")
      .optional()
      .isIn([0, 1])
      .withMessage(CONFIG.INVALID_STATUS),
    body("module")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),
    body("methods")
      .optional()
      .isArray()
      .custom((values) => {
        values.map((value) => {
          if (!resourceMethods.includes(value)) {
            throw new Error(CONFIG.INVALID_METHOD);
          }
        });
      }),
  ];
};
const deleteResource = () => {
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

const addResourceModule = () => {
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
    body("moduleID")
      .exists()
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
  addResource,
  updateResource,
  deleteResource,
  addResourceModule,
  isRequestValid,
};
