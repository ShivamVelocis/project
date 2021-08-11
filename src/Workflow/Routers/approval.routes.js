const express = require("express");
const router = express.Router();
const approvalControllers = require("../Controllers/approval.contoller");

// router.get("/", workflowControllers.getWorkflows);
router.post("/", approvalControllers.approvalContent);
router.post("/:id", approvalControllers.getContentFlow);
// router.delete("/", workflowControllers.deleteWorkflow);

module.exports = router;