const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const { validateUser } = require("../../middlewares/auth");
const {adminRole} = require("../../middlewares/roleAuth")
const { loginValidationRules,addUserValidationRules, updateUserValidationRules, mongoIDValidationRules,validate } = require("../middlewares/validater");
// const {roleValidator}=require("../../utils/validationHelper")

router.get("/add",adminRole, userController.addUser);
router.post("/add",adminRole,addUserValidationRules(), validate, userController.postAddUser);
router.get("/view", validateUser, userController.getUsers);
router.get("/view/:id", mongoIDValidationRules(),userController.getUser);

router.get("/update/:id",mongoIDValidationRules(),validate, userController.updateUser);
router.post("/update/:id",updateUserValidationRules(),validate, userController.postUpdateUser);
router.post("/delete/:id", mongoIDValidationRules(), validate, userController.removeContent);
router.get("/auth/login", authController.login);
router.get("/auth/logout", authController.logOut);
router.post("/auth/login", authController.postLogin);
router.get("/forgetpassword/", authController.forgetPassword);
router.post("/forgetpassword/", authController.postForgetPassword);
router.get("/pwdreset/:token", authController.otpVerification);
router.post("/pwdreset/:token", authController.postOtpVerification);

module.exports = router;
