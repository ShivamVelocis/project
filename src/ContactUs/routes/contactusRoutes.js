const express = require("express");
const router = express.Router();
const controller = require("../controller/contactusController");
const {  contentValidationRules, mongoIDValidationRules, validate} = require("../middlewares/validater");

router.get("/addcontactus", controller.contactusForm);
router.post("/addcontactus", contentValidationRules(), validate, controller.addContactus);
router.get("/all", controller.getAllcontactus);
router.get("/view/:id", mongoIDValidationRules(),validate,controller.getContactus);
router.get("/update/:id", controller.contactusToUpdate);
router.post("/update/:id",mongoIDValidationRules(),contentValidationRules(), validate, controller.updateContactus);
router.get("/remove/:id", mongoIDValidationRules(),validate,controller.removeContactus);

module.exports = router;
