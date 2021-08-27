
const ObjectId = require("mongoose").isValidObjectId;
const { check, body, validationResult, param } = require('express-validator');
//const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/; /* 'password must contain at least one uppercase letter, one lowercase letter and one number' */

const numberOnlyRegex = /^[ 0-9]*$/;
const charOnlyRegex = /^[ A-Za-z]*$/;
const alphanumericOnlyRegex = /^[ A-Za-z0-9]*$/;
const textFieldRegex = /^[ A-Za-z0-9_.\/,]*$/;
const textAreaRegex = /^[ A-Za-z0-9_.\/,<>]*$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/; // Password must contain at least one uppercase letter, one lowercase letter and one number
const email = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;




let addMenu=[
    check('menu_title')
        .notEmpty() .withMessage('Menu title is require'),

    check('menu_link')
        .notEmpty() .withMessage('Menu link is require'), 

    check('menu_status')
        .notEmpty() .withMessage('The status is require')        
];


let updateMenu=[
    check('menu_title')
        .notEmpty() .withMessage('Menu title is require'),

    check('menu_link')
        .notEmpty() .withMessage('Menu link is require'), 

    check('menu_status')
        .notEmpty() .withMessage('The status is require') 
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



module.exports = {
    addMenu: addMenu ,
    updateMenu: updateMenu,
    validateError: validateError
}