const express = require("express");
const router = express.Router();
const controller = require("../controller/roleContoller");


const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");
router.post("/", contentValidationRules(), validate, controller.addRole);
router.get("/", controller.getAllRole);
router.get("/:id",mongoIDValidationRules(),validate, controller.getRole);
router.put("/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateRole);
router.delete("/:id", mongoIDValidationRules(),validate, controller.removeRole);

module.exports = router;
