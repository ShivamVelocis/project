const ObjectId = require("mongoose").Types.ObjectId;
const { check, body, validationResult, param } = require("express-validator");
//const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/; /* 'password must contain at least one uppercase letter, one lowercase letter and one number' */

const numberOnlyRegex = /^[ 0-9]*$/;
const charOnlyRegex = /^[ A-Za-z]*$/;
const alphanumericOnlyRegex = /^[ A-Za-z0-9]*$/;
const textFieldRegex = /^[ A-Za-z0-9_.\/,]*$/;
const textAreaRegex = /^[ A-Za-z0-9_.\/,<>]*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/; // Password must contain at least one uppercase letter, one lowercase letter and one number
const email = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

let validateUserLogin = [
  check("password")
    .isLength({ min: 5 })
    .withMessage("The password must be 5+ chars long and contain a number"),
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("The valid email require"),
  check("username").notEmpty().withMessage("The Username is require"),
];

let validateUserAdd = [
  check("user_status")
    .notEmpty()
    .withMessage("Please select Role")
    .isIn([1, 0])
    .withMessage("Role value should be 1 or 0"),

  check("password")
    .matches(passwordRegex)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter and one number"
    ),
  check("email").matches(email).withMessage("Email is not valid."),

  check("username").notEmpty().withMessage("The Username is require"),

  check("first_name")
    .notEmpty()
    .withMessage("The first name is require")
    .matches(charOnlyRegex)
    .withMessage("Only allow characters"),

  check("role_id").custom((value, { req }) => {
    if (!isValidObjectId(value)) {
      throw new Error("Role id should be valid mongodb id");
    }
    return true;
  }),
];

let validateUserUpdate = [
  check("role_id").notEmpty().withMessage("Please select Role"),

  check("email")
    .matches(/^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email is not valid."),

  check("first_name")
    .notEmpty()
    .withMessage("The first name is require")
    .matches(/^[a-zA-Z]/)
    .withMessage("Special characters are not allowed in the first name field"),
    
  check("role_id").custom((value, { req }) => {
    if (!isValidObjectId(value)) {
      throw new Error("Role id should be valid mongodb id");
    }
    return true;
  }),
];

// middleware to check if any error encouter during validation
const validateError = (req, res) => {
  const validationErrors = validationResult(req);

  const extractedErrors = [];
  validationErrors.array().map((err) => extractedErrors.push(err.msg));

  //   errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  //   console.log({ error: extractedErrors });
  return extractedErrors;

  //response for postmon
  //   return res.status(422).json({
  //     errors: extractedErrors,
  //   });
};

/*
let errorsArr = [];
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
      //console.log('============================================');
        let errors1= Object.values(validationErrors.mapped());
        errors1.forEach((item) =>{
            errorsArr.push(item.msg);
        })

*/

module.exports = {
  validateUserLogin: validateUserLogin,
  validateUserAdd: validateUserAdd,
  validateUserUpdate: validateUserUpdate,
  validateError: validateError,
};
