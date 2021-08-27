const express = require("express");
const router = express.Router();
const controller = require("../controller/feedbackController");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");

router.post("/", contentValidationRules(), validate, controller.addFeedback);
router.get("/", controller.getAllFeedback);
router.get("/:id", mongoIDValidationRules(),validate,controller.getFeedback);
router.put("/",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateFeedback);
router.delete("/:id", mongoIDValidationRules(),validate,controller.removeFeedback);

module.exports = router;
