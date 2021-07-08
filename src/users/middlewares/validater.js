const { body, validationResult, param } = require("express-validator");
const ObjectId = require("mongoose").isValidObjectId;
const CONFIG = require("../configs/config");

// add new user request body validater
exports.addUserValidationRules = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .isEmail()
      .withMessage(CONFIG.INVALID_EMAIL),

    body("password")
      .exists()
      .withMessage(CONFIG.INVALID_PASSWORD)
      .bail()
      .custom((value, { req }) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_PASSWORD);
        }
        if (value.match(CONFIG.PASSWORD_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_PASSWORD);
        }
        return true;
      }),

    body("role_id")
      .exists()
      .withMessage(CONFIG.INVALID_ROLE)
      .bail()
      .custom((value, { req }) => {
        if (value) {
          return true;
        }
        throw new Error(CONFIG.INVALID_ROLE);
      }),

    body("username")
      .exists()
      .withMessage(CONFIG.EMPTY_USER_NAME)
      .bail()
      .custom((value, { req }) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_USER_NAME);
        }
        if (value.match(CONFIG.TITLE_PATTERN) == null) {
          throw new Error(CONFIG.INVALID_USER_NAME);
        }
        return true;
      }),

    body("user_status")
      .exists()
      .withMessage(CONFIG.INVALID_STATUS)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_STATUS);
      }),
  ];
};

// updating user request body validater
exports.updateUserValidationRules = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .isEmail()
      .withMessage(CONFIG.INVALID_EMAIL),

    body("role_id")
      .exists()
      .withMessage(CONFIG.INVALID_ROLE)
      .bail()
      .custom((value, { req }) => {
        if (value) {
          return true;
        }
        throw new Error(CONFIG.INVALID_ROLE);
      }),

    body("user_status")
      .exists()
      .withMessage(CONFIG.INVALID_STATUS)
      .bail()
      .custom((value, { req }) => {
        if (value == 1 || value == 2) {
          return true;
        }
        throw new Error(CONFIG.INVALID_STATUS);
      }),
  ];
};

//change my password request body validator
exports.changeMyPasswordValidationRule = () => {
  return [
    body("currentPassword")
      .exists()
      .withMessage(CONFIG.INVALID_PASSWORD)
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      )
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};
//change password request body validator
exports.changePasswordValidationRule = () => {
  return [
    body("newPassword")
      .exists()
      .withMessage(CONFIG.INVALID_NEW_PASSWORD)
      .bail()
      .notEmpty()
      .withMessage(CONFIG.EMPTY_NEW_PASSWORD)
      .bail()
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      )
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};
//change password request body validator with otp
exports.otpPasswordValidationRule = () => {
  return [
    body("otp")
      .exists()
      .withMessage(CONFIG.EMPTY_OTP)
      .bail()
      .custom((value, { req }) => {
        if (value == "") {
          throw new Error(CONFIG.EMPTY_OTP);
        }
        if (value.length !== 4) {
          // console.log(value.length);
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
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
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter and one number"
      )
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error(CONFIG.NEW_CONFIRM_ERROR);
        }
        return true;
      }),
  ];
};

//forget password email validation in request body
exports.forgetpasswordEmailValidation = () => {
  return [
    body("email")
      .exists()
      .withMessage(CONFIG.INVALID_EMAIL)
      .isEmail()
      .withMessage(CONFIG.INVALID_EMAIL),
  ];
};

// mongodb id validater for get request
exports.mongoIDValidationRules = () => {
  return param("id")
    .exists()
    .withMessage(CONFIG.INVALID_MONGO_ID)
    .bail()
    .custom((value) => {
      // console.log(value);
      if (!ObjectId(value)) {
        throw new Error(CONFIG.INVALID_MONGO_ID);
      }
      return true;
    });
};

// middleware to check if any error encouter during validation
exports.isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // console.log(errors)
  errors.array().map((err) => extractedErrors.push(err.msg));
  res.locals.validationError =
    extractedErrors.length > 0 ? extractedErrors : null;
  next();
};
