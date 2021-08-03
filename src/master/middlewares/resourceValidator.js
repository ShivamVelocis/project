const { body, validationResult } = require("express-validator");
const CONFIG = require("../configs/config");
const ObjectId = require("mongoose").isValidObjectId;

let resourceMethods = ["GET", "POST", "PUT", "DELETE"];

const addResource = () => {
  return [
    body("*.resource_name").exists().isString(),
    body("*.resource_path").exists().isURL(),
    body("*.resource_status")
      .exists()
      .isIn([0, 1])
      .withMessage("Status should be 1 or 0"),
    body("*.module").exists().isString(),
    body("*.methods").exists().isArray(),
    body("*.methods.*")
      .isIn(["GET", "POST", "PUT", "DELETE"])
      .withMessage("Method should valid http methods"),
  ];
};
const updateResource = () => {
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
    body("resource_name").optional().isString(),
    body("resource_path").optional().isURL(),
    body("resource_status")
      .optional()
      .isIn([0, 1])
      .withMessage("Status should be 1 or 0"),
    body("module").optional().isString(),
    body("methods")
      .optional()
      .isArray()
      .custom((values) => {
        values.map((value) => {
          if (!resourceMethods.includes(value)) {
            throw new Error(`Method should valid http methods`);
          }
        });
      }),
  ];
};
const deleteResource = () => {
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

const addResourceModule = () => {
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
    body("moduleID")
      .exists()
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
  addResource,
  updateResource,
  deleteResource,
  addResourceModule,
  isRequestValid,
};
