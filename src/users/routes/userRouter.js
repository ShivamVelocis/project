const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const { validateUser } = require("../../middlewares/auth");
const {adminRole} = require("../../middlewares/roleAuth")
const { loginValidationRules,addUserValidationRules, validate } = require("../middlewares/validater");
// const {roleValidator}=require("../../utils/validationHelper")

router.get("/add",adminRole, userController.addUser);
router.post("/add",adminRole,addUserValidationRules(),validate, userController.postAddUser);
router.get("/view", validateUser, userController.getUsers);
router.get("/view/:id", userController.getUser);

router.get("/update/:id", userController.updateUser);
router.post("/update/:id", userController.postUpdateUser);
router.post("/delete/:id", userController.removeContent);
router.get("/auth/login", authController.login);
router.get("/auth/logout", authController.logOut);
router.post("/auth/login", loginValidationRules(), validate, authController.postLogin);
router.get("/forgetpassword/", authController.forgetPassword);
router.post("/forgetpassword/", authController.postForgetPassword);
router.get("/pwdreset/:token", authController.otpVerification);
router.post("/pwdreset/:token", authController.postOtpVerification);

module.exports = router;
