const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const { isUserLoggedIn } = require("../../middlewares/auth");
const { addUserValidationRules, updateUserValidationRules,changePasswordValidationRule,changeMyPasswordValidationRule,otpPasswordValidationRule,forgetpasswordEmailValidation, mongoIDValidationRules,isRequestValid } = require("../middlewares/validater");
const userValidationRules = require('./../validations/UserValidation');
const { uploadProfilePicture } = require("../utils/uploadHandler");


router.get("/add", userController.addUser); //render add user page 
//router.post("/add",isAdmin, addUserValidationRules(), isRequestValid , userController.postAddUser); // add user to database if valid
router.post("/add", userValidationRules.validateUserAdd, userController.postAddUser);

router.get("/view", isUserLoggedIn, userController.getUsers); // renders all users
router.get("/view/:id", isUserLoggedIn, mongoIDValidationRules(),userController.getUser); //render user with id given in url

router.get("/update/:id",isUserLoggedIn,mongoIDValidationRules(),isRequestValid , userController.updateUser); //render update/edit user page 
//router.post("/update/:id",isUserLoggedIn,updateUserValidationRules(),isRequestValid , userController.postUpdateUser); //updates user eith new data in db
router.post("/update/:id",updateUserValidationRules(),isRequestValid,isUserLoggedIn,userValidationRules.validateUserUpdate, userController.postUpdateUser);

router.post("/delete/:id",isUserLoggedIn, mongoIDValidationRules(), isRequestValid , userController.removeContent); //deletes user with id given in url

router.get("/auth/login", authController.login); //render login page
router.post("/auth/login", authController.postLogin); //genrate token and send to user in session also store in db
router.get("/auth/logout", authController.logOut); // destroy session and redirect to login page
router.get("/forgetpassword/", authController.forgetPassword); //render forget password page
router.post("/forgetpassword/",forgetpasswordEmailValidation(),isRequestValid, authController.postForgetPassword); //add otp and token for url expiry to db and sent same to registered user if 
router.get("/pwdreset/:token", authController.otpVerification);//render page to reset password provide otp 
router.post("/pwdreset/:token", otpPasswordValidationRule(),isRequestValid,authController.postOtpVerification); // reset user password if url not expired and redirect to login page


//change user password
router.get('/changepwd/:id',isUserLoggedIn, authController.changePassword)
router.post('/changepwd/:id', isUserLoggedIn,changePasswordValidationRule(),isRequestValid,authController.postChangePassword)

//change user password
router.get('/change-my-password/',isUserLoggedIn, authController.changeMyPassword)
router.post('/change-my-password/', isUserLoggedIn,changeMyPasswordValidationRule(),isRequestValid,authController.postChangeMyPassword)



//upload profile Picture
router.get('/upload/profile/:id',isUserLoggedIn,userController.uploadProfilePicture)
router.post('/upload/profile/:id',isUserLoggedIn,uploadProfilePicture,userController.postUploadProfilePicture)
router.get('/profile/:id',isUserLoggedIn,userController.getProfilePicture)


//myprofile
router.get('/profile',isUserLoggedIn,authController.myprofile)



//excel
router.get('/excelExport',userController.getUsersExcel)

module.exports = router;
