const express = require("express");
const router = express.Router();
const userController = require("./../controller/authController");

router.post("/login", authController.login);

module.exports = router;
