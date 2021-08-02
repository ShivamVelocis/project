const express = require("express");
const router = express.Router();
const controller = require("../controller/contactusController");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");

router.post("/", contentValidationRules(), validate, controller.addContactus);
router.get("/", controller.getAllcontactus);
router.get("/:id", mongoIDValidationRules(),validate,controller.getContactus);
router.put("/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateContactus);
router.delete("/:id", mongoIDValidationRules(),validate,controller.removeContactus);

module.exports = router;
