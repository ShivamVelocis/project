const aclController = require("../contollers/aclController");
const express = require("express");
const { addACLRuleValidation, isRequestValid, updateACLRuleValidation } = require("../middlewares/req_Validator");
const router = express.Router();

router.get("/",aclController.getAcls);
router.post("/", aclController.addAcl);
router.put("/", aclController.editAcl);
router.delete("/", aclController.deletAcl);
router.get("/:id", aclController.getAcl);


module.exports = router;
