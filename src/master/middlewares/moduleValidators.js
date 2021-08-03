const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");

const addModule = () => {
  return [
    body("module_name").exists().withMessage("").isString().withMessage(""),
    body("module_status")
      .exists()
      .withMessage("")
      .isIn([1, 0, 1])
      .withMessage("Methods should be valid http methods"),
  ];
};
const updateModule = () => {
  return [
    body("id").exists().withMessage("id should not be empty"),
    body("module_name").isString().withMessage(""),
    body("module_status")
      .isIn([1, 0, 1])
      .withMessage("Methods should be valid http methods"),
  ];
};

const removeModuleResource = () => {
  return [
    body("id").exists().withMessage("id should not be empty"),
    body("resourceID").exists().withMessage("id should not be empty"),
  ];
};

const addModuleResource = () => {
  return [
    body("moduleName")
      .exists()
      .withMessage("id should not be empty")
      .isString()
      .withMessage(""),
    body("resourcesId").exists().withMessage("id should not be empty"),
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
  removeModuleResource,
  addModuleResource,
};
