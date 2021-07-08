const express = require("express");
const router = express.Router();
const controller = require("../controller/feedbackController");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");

router.get("/addfeedback", controller.feedbackForm);
router.post("/addfeedback", contentValidationRules(), validate, controller.addFeedback);
router.get("/all", controller.getAllFeedback);
router.get("/view/:id", mongoIDValidationRules(),validate,controller.getFeedback);
router.get("/update/:id", controller.feedbackToUpdate);
router.post("/updateFeedback/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateFeedback);
router.get("/remove/:id", mongoIDValidationRules(),validate,controller.removeFeedback);

module.exports = router;
