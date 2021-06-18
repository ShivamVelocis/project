const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");
const authController = require("./../controller/authController");
const { validateUser } = require("../../middlewares/auth");

router.get("/add", userController.addUser);
router.post("/add", userController.postAddUser);
router.get("/view", validateUser, userController.getUsers);
router.get("/view/:id", userController.getUser);

router.get("/update/:id", userController.updateUser);
router.post("/update/:id", userController.postUpdateUser);
router.post("/delete/:id", userController.removeContent);
router.get("/auth/login", authController.login);
router.post("/auth/login", authController.postLogin);

module.exports = router;
