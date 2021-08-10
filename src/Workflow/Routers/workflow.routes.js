const express = require("express");
const router = express.Router();
const workflowControllers = require("../Controllers/workflow.Controller");

router.get("/", workflowControllers.getWorkflows);
router.post("/", workflowControllers.addWorkflow);
router.delete("/", workflowControllers.deleteWorkflow);

module.exports = router;
