const express = require("express");
const router = express.Router();
const approvalControllers = require("../Controllers/approval.contoller");

// router.get("/", workflowControllers.getWorkflows);
router.post("/create", approvalControllers.addToapproval);

// approve or process approval steps
router.post("/", approvalControllers.approval);

// action avaliable
router.post("/:id", approvalControllers.getApprovalData);

// get all approval table data
router.get("/", approvalControllers.getApprovalsData);

// get status o
router.get("/:id", approvalControllers.getWfStatu);


module.exports = router;
