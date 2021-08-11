const { body, check, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require("../configs/config");

// add new user request body validater
exports.addUserRules = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .bail()
      .isEmail()
      .withMessage(CONFIG.INVALID_EMAIL),

    check("password")
      .matches(CONFIG.PASSWORD_PATTERN)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),

    body("role_id")
      .exists()
      .withMessage(CONFIG.INVALID_ROLE)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),

    body("username")
      .exists()
      .withMessage(CONFIG.EMPTY_USER_NAME)
      .bail()
      .matches(CONFIG.CHARONLYREGEX)
      .withMessage(CONFIG.CHARACTER_ONLY)
      .bail()
      .custom((value) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_USER_NAME);
        }
        return true;
      }),

    body("user_status")
      .exists()
      .withMessage(CONFIG.INVALID_STATUS)
      .bail()
      .isIn([0, 1])
      .withMessage(CONFIG.INVALID_USER_STATUS),

    check("first_name")
      .notEmpty()
      .withMessage("The first name is require")
      .bail()
      .matches(CONFIG.CHARONLYREGEX)
      .withMessage(CONFIG.CHARACTER_ONLY),
  ];
};

// updating user request body validater
exports.updateUsernRules = () => {
  return [
    body("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),

    body("email")
      .optional()
      .matches(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/)
      .withMessage(CONFIG.INVALID_EMAIL),

    body("role_id")
      .optional()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGODB_ID);
        }
        return true;
      }),

    body("user_status").optional().isIn([0, 1]),

    check("first_name")
      .optional()
      .matches(CONFIG.CHARONLYREGEX)
      .withMessage(CONFIG.CHARACTER_ONLY),
  ];
};

exports.getUserRule = () => {
  return [
    param("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGO_ID);
        }
        return true;
      }),
  ];
};

exports.deleteUserRule = () => {
  return [
    body("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGO_ID);
        }
        return true;
      }),
  ];
};

exports.getUserProfileRule = () => {
  return [
    body("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGO_ID);
        }
        return true;
      }),
  ];
};

//change my password request body validator
exports.changeMyPasswordRule = () => {
  return [
    body("currentPassword")
      .exists()
      .withMessage(CONFIG.INVALID_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_CURRENT_PASSWORD)
      .bail()
      .matches(CONFIG.PASSWORD_PATTERN)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),

    body("newPassword")
      .exists()
      .withMessage(CONFIG.INVALID_NEW_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .matches(CONFIG.PASSWORD_PATTERN)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),

    body("confirmPassword")
      .exists()
      .withMessage(CONFIG.EMPTY_CONFIRM_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_CURRENT_PASSWORD)
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};
//change password request body validator
exports.changePasswordRule = () => {
  return [
    body("id")
      .exists()
      .withMessage(CONFIG.EMPTY_ID)
      .bail()
      .custom((value) => {
        if (!ObjectId(value)) {
          throw new Error(CONFIG.INVALID_MONGO_ID);
        }
        return true;
      }),

    body("newPassword")
      .exists()
      .withMessage(CONFIG.INVALID_NEW_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .matches(CONFIG.PASSWORD_PATTERN)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),

    body("confirmPassword")
      .exists()
      .withMessage(CONFIG.EMPTY_CONFIRM_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .custom((value, { req }) => {
        if (value != req.body.newPassword) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};
//change password request body validator with otp
exports.otpPasswordRule = () => {
  return [
    body("otp")
      .exists()
      .withMessage(CONFIG.EMPTY_OTP)
      .bail()
      .custom((value) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_OTP);
        }
        if (value.length !== 4) {
          throw new Error(CONFIG.INVALID_OTP);
        }
        return true;
      }),

    body("password")
      .exists()
      .withMessage(CONFIG.INVALID_NEW_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .matches(CONFIG.PASSWORD_PATTERN)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      ),

    body("confirmPassword")
      .exists()
      .withMessage(CONFIG.EMPTY_CONFIRM_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .custom((value, { req }) => {
        // console.log(value , req.body.password)
        if (value != req.body.password) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};

//forget password email validation in request body
exports.forgetpasswordRule = () => {
  return [body("email").isEmail().withMessage(CONFIG.INVALID_EMAIL)];
};

/**--------------------Auth Validator--------------------------------- */

exports.validateUserLogin = () => {
  return [
    check("password")
      .isLength({ min: 5 })
      .withMessage("The password must be 5+ chars long and contain a number"),

    check("email")
      .normalizeEmail()
      .isEmail()
      .withMessage("The valid email require"),

    check("username").notEmpty().withMessage("The Username is require"),
  ];
};

// middleware to check if any error encouter during validation
exports.isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // console.log(errors);
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  if (extractedErrors) {
    res.status(400);
    return res.json({ success: false, message: extractedErrors, data: null });
  }
  next();
};
