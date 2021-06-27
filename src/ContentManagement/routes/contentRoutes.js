const express = require("express");
const router = express.Router();


const controller = require("../controller/contentController");
const {  contentValidationRules, mongoIDValidationRules, isRequestValid} = require("../middlewares/validater");

router.get("/", controller.contentForm);
router.post("/", contentValidationRules(), isRequestValid, controller.addContent);
router.get("/all", controller.getContents);
router.get("/:id", mongoIDValidationRules(),isRequestValid,controller.getContent);
router.get("/update/:id", controller.contentToUpdate);
router.post("/updateContent/:id",mongoIDValidationRules(),contentValidationRules(), isRequestValid, controller.updateContent);
router.get("/remove/:id", mongoIDValidationRules(),isRequestValid,controller.removeContent);

module.exports = router;
