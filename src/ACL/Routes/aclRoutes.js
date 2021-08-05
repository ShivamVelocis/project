const aclController = require("../contollers/aclController");
const express = require("express");
const {
  addACLRuleValidation,
  isRequestValid,
  updateACLRuleValidation,
  deleteACLRuleValidation,
} = require("../middlewares/req_Validator");
const router = express.Router();

router.get("/", aclController.getAcls);
router.post("/", addACLRuleValidation(), isRequestValid, aclController.addAcl);
router.put("/",updateACLRuleValidation(), isRequestValid, aclController.editAcl);
router.delete(  "/", deleteACLRuleValidation(), isRequestValid, aclController.deletAcl);
router.get("/:id", aclController.getAcl);

module.exports = router;
