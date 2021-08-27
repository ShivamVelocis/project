const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;
// console.log(CONFIG)

const addModule = () => {
  return [
    body("*.module_name").exists().isString(),
    body("*.module_status")
      .exists()
      .isIn([0, 1])
      .withMessage(CONFIG.INVALID_STATUS),
  ];
};

const updateModule = () => {
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
    body("module_name").isString(),
    body("module_status").isIn([1, 0]).withMessage(CONFIG.INVALID_STATUS),
  ];
};

const deleteModule = () => {
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

const removeModuleResource = () => {
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
    body("resourceID")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURSCE_ID),
    body("resourceID.*").custom((value) => {
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGODB_ID);
      }
      return true;
    }),
  ];
};

const addModuleResource = () => {
  return [
    body("moduleName").exists().withMessage(CONFIG.EMPTY_ID).isString(),
    body("resourcesId")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .isArray()
      .withMessage(CONFIG.INVALID_RESOURSCE_ID),
    body("resourcesId.*").custom((value) => {
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
  addModule,
  updateModule,
  deleteModule,
  removeModuleResource,
  addModuleResource,
  isRequestValid,
};
