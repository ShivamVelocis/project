const express = require("express");
const router = express.Router();
const approvalControllers = require("../Controllers/approval.contoller");

router.get("/", approvalControllers.getApprovalsData);
router.post("/", approvalControllers.addForApproval);
router.put("/", approvalControllers.approvalAction);
router.post("/nextaction/:id", approvalControllers.nextActionAllowed);
router.get("/:id", approvalControllers.getWfStatu);

module.exports = router;
