const express = require("express");
const router = express.Router();
const approvalControllers = require("../Controllers/approval.contoller");

// router.get("/", workflowControllers.getWorkflows);
router.post("/create", approvalControllers.addToapproval);
router.post("/", approvalControllers.approval);
router.post("/:id", approvalControllers.getApprovalData);
router.get("/:id", approvalControllers.getWfStatu);
// router.delete("/", workflowControllers.deleteWorkflow);

module.exports = router;
