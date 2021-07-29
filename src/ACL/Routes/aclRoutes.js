const aclController = require("../contollers/aclController");
const express = require("express");
const { addACLRuleValidation, isRequestValid, updateACLRuleValidation } = require("../middlewares/req_Validator");
const router = express.Router();

router.get("/",aclController.getAcls);
router.post("/",addACLRuleValidation(), isRequestValid, aclController.addACl);
router.put("/",updateACLRuleValidation(), isRequestValid , aclController.editACl);
router.delete("/", aclController.deletACl);
router.get("/:id", aclController.getAcl);


module.exports = router;
