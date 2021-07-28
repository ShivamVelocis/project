const express = require("express");
const router = express.Router();
const controller = require("../controller/roleContoller");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");
router.get("/addrole", controller.roleForm);
router.post("/addrole", contentValidationRules(), validate, controller.addRole);
router.get("/all", controller.getAllRole);
router.get("/view/:id",mongoIDValidationRules(),validate, controller.getRole);
router.get("/update/:id", controller.roleToUpdate);
router.post("/update/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateRole);
router.get("/delete/:id", mongoIDValidationRules(),validate, controller.removeRole);

module.exports = router;
