const express = require("express");
const router = express.Router();


const controller = require("../controller/contentController");
const {  contentValidationRules, mongoIDValidationRules, isRequestValid} = require("../middlewares/validater");

router.post("/", contentValidationRules(), isRequestValid, controller.addContent);
router.get("/", controller.getContents);
router.put("/",mongoIDValidationRules(),contentValidationRules(), isRequestValid, controller.updateContent);
router.delete("/", mongoIDValidationRules(),isRequestValid,controller.removeContent);
router.get("/:id", mongoIDValidationRules(),isRequestValid,controller.getContent);

module.exports = router;
