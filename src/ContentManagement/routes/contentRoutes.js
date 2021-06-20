const express = require("express");
const router = express.Router();
const controller = require("../controller/contentController");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../../middlewares/validater");

router.get("/", controller.contentForm);
router.post("/", contentValidationRules(), validate, controller.addContent);
router.get("/all", controller.getContents);
router.get("/:id", mongoIDValidationRules(),validate,controller.getContent);
router.get("/update/:id", controller.contentToUpdate);
router.post("/updateContent/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateContent);
router.get("/remove/:id", mongoIDValidationRules(),validate,controller.removeContent);

module.exports = router;
