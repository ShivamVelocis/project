const express = require("express");
const router = express.Router();
const userController = require("./../controller/userController");


router.get("/add", userController.addUser);
router.post("/add", userController.postAddUser);
router.get("/view", userController.getUsers);
router.get("/view/:id", userController.getUser);

router.get("/update/:id", userController.updateUser);
router.post("/update/:id", userController.postUpdateUser);
router.post("/delete/:id", userController.removeContent);

module.exports = router;
