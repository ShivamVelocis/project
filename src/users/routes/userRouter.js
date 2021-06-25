const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const { validateUser } = require("../../middlewares/auth");
const {adminRole} = require("../../middlewares/roleAuth")
const { addUserValidationRules, updateUserValidationRules, mongoIDValidationRules,validate } = require("../middlewares/validater");


router.get("/add",adminRole, userController.addUser); //render add user page 
router.post("/add",adminRole,addUserValidationRules(), validate, userController.postAddUser); // add user to database if valid
router.get("/view", validateUser, userController.getUsers); // renders all users
router.get("/view/:id", mongoIDValidationRules(),userController.getUser); //render user with id given in url
router.get("/update/:id",mongoIDValidationRules(),validate, userController.updateUser); //render update/edit user page 
router.post("/update/:id",updateUserValidationRules(),validate, userController.postUpdateUser); //updates user eith new data in db
router.post("/delete/:id", mongoIDValidationRules(), validate, userController.removeContent); //deletes user with id given in url
router.get("/auth/login", authController.login); //render login page
router.post("/auth/login", authController.postLogin); //genrate token and send to user in session also store in db
router.get("/auth/logout", authController.logOut); // destroy session and redirect to login page
router.get("/forgetpassword/", authController.forgetPassword); //render forget password page
router.post("/forgetpassword/", authController.postForgetPassword); //add otp and token for url expiry to db and sent same to registered user if 
router.get("/pwdreset/:token", authController.otpVerification);//render page to reset password provide otp 
router.post("/pwdreset/:token", authController.postOtpVerification); // reset user password if url not expired and redirect to login page

router.get('/changepwd/:id', authController.changePassword)
router.post('/changepwd/:id', authController.postChangePassword)

module.exports = router;
