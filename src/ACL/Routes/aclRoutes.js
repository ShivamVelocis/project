const aclController = require("../contollers/aclController");
const express = require("express");
const validation = require("../middlewares/validator");
const router = express.Router();

router.get("/getchildren",aclController.getAllChildrenData)
router.get("/", aclController.getAcls);
router.post("/", validation.addACLRuleValidation(), validation.isRequestValid, aclController.addAcl);
router.put("/",validation.updateACLRuleValidation(), validation.isRequestValid, aclController.editAcl);
router.delete(  "/", validation.deleteACLRuleValidation(), validation.isRequestValid, aclController.deletAcl);
router.post("/check",aclController.aclCheck)
router.get("/:id", aclController.getAcl);



module.exports = router;
