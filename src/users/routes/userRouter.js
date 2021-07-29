const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
// const { isUserLoggedIn } = require("../../middlewares/auth");
const { updateUserValidationRules,changePasswordValidationRule,changeMyPasswordValidationRule,otpPasswordValidationRule,forgetpasswordEmailValidation, mongoIDValidationRules,isRequestValid } = require("../middlewares/validater");
const userValidationRules = require('./../validations/UserValidation');
const { uploadProfilePicture } = require("../utils/uploadHandler");

//User management
router.get("/", userController.getUsers); 
router.get("/:id", mongoIDValidationRules(),userController.getUser); 
router.post("/", userValidationRules.validateUserAdd, userController.addUser);
router.put("/",updateUserValidationRules(),isRequestValid,userValidationRules.validateUserUpdate, userController.updateUser);
router.delete("/", mongoIDValidationRules(), isRequestValid , userController.removeUser); 

//Auth
router.post("/login", authController.userLogin); //genrate token and send to user in session also store in db
router.get("/logout", authController.logOut); // destroy session and redirect to login page

//change password
router.post("/forgetpassword/",forgetpasswordEmailValidation(),isRequestValid, authController.forgetPassword); //add otp and token for url expiry to db and sent same to registered user if 
router.post("/pwdreset/:token", otpPasswordValidationRule(),isRequestValid,authController.otpVerification); // reset user password if url not expired and redirect to login page

router.post('/changepwd/',changePasswordValidationRule(),isRequestValid,authController.changePassword)
router.post('/change-my-password/',changeMyPasswordValidationRule(),isRequestValid,authController.changeMyPassword)



//upload profile Picture
router.get('/profile/:id',userController.getProfilePicture)
router.post('/profile/:id',uploadProfilePicture,userController.uploadProfilePicture)

module.exports = router;
