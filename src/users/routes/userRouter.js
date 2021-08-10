const express = require("express");
const router = express.Router();


const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const Validtor = require("../middlewares/validater");
const { uploadProfilePicture } = require("../utils/uploadHandler");

//User management
router.get("/", userController.getUsers); 
router.post("/",Validtor.addUserRules(),Validtor.isRequestValid, userController.addUser);
router.put("/",Validtor.updateUsernRules(),Validtor.isRequestValid,userController.updateUser);
router.delete("/", Validtor.deleteUserRule(), Validtor.isRequestValid , userController.removeUser); 

//Auth
router.post("/login", authController.userLogin); //genrate token and send to user in session also store in db

//forget password and reset using otp and link send to email
router.post("/forgetpassword/",Validtor.forgetpasswordRule(),Validtor.isRequestValid, authController.forgetPassword); //add otp and token for url expiry to db and sent same to registered user if 
router.post("/pwdreset/:token", Validtor.otpPasswordRule(),Validtor.isRequestValid,authController.otpVerification); // reset user password if url not expired and redirect to login page


//admin change other users password
router.post('/changepwd/',Validtor.changePasswordRule(),Validtor.isRequestValid,authController.changePassword)
//user change own password
router.post('/change-my-password/',Validtor.changeMyPasswordRule(),Validtor.isRequestValid,authController.changeMyPassword)



//Profile Picture
router.get('/profile/',Validtor.getUserProfileRule(),userController.getProfilePicture)
router.post('/profile/',uploadProfilePicture,userController.uploadProfilePicture)


//get user by id
router.get("/:id",Validtor.getUserRule(), Validtor.isRequestValid ,userController.getUser); 

module.exports = router;
