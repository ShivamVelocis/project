const aclController = require("../contollers/aclController");
const express = require("express");
const validation = require("../middlewares/req_Validator");
const router = express.Router();

router.get("/", aclController.getAcls);
router.post("/", validation.addACLRuleValidation(), validation.isRequestValid, aclController.addAcl);
router.put("/",validation.updateACLRuleValidation(), validation.isRequestValid, aclController.editAcl);
router.delete(  "/", validation.deleteACLRuleValidation(), validation.isRequestValid, aclController.deletAcl);
router.post("/check",aclController.aclCheck)
router.get("/:id", aclController.getAcl);

module.exports = router;
