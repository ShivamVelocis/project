const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;

const addModule = () => {
  return [
    body("module_name").exists().withMessage("").isString().withMessage(""),
    body("module_status")
      .exists()
      .withMessage("")
      .isIn([0, 1])
      .withMessage("Status should be 1 or 0"),
  ];
};
const updateModule = () => {
  return [
    body("id")
      .exists()
      .withMessage("id should not be empty")
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("module_name").isString().withMessage(""),
    body("module_status")
      .isIn([1, 0, 1])
      .withMessage("Methods should be valid http methods"),
  ];
};
const deleteModule = () => {
  return [
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

const removeModuleResource = () => {
  return [
    body("id")
      .exists()
      .withMessage("id should not be empty")
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error("Please enter valid  MongoDB ID");
        }
        return true;
      }),
    body("resourceID")
      .exists()
      .withMessage("id should not be empty")
      .isArray()
      .withMessage("resourceID should be a array"),
      body("resourceID.*").custom((value) => {
      if (!ObjectId(value)) {
        throw new Error("Please enter valid  MongoDB ID");
      }
      return true;
    }),
  ];
};

const addModuleResource = () => {
  return [
    body("moduleName")
      .exists()
      .withMessage("id should not be empty")
      .isString(),
    body("resourcesId")
      .exists()
      .withMessage("id should not be empty")
      .isArray()
      .withMessage("resourcesId should be a array"),
      body("resourcesId.*").custom((value) => {
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
  addModule,
  updateModule,
  deleteModule,
  removeModuleResource,
  addModuleResource,
  isRequestValid,
};
