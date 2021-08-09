const mongoose = require("mongoose");

let workflowApprovalSchema = new mongoose.Schema(
  {
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    state: String,
    contentStatus: String,
    isStartState: Boolean,
    isTerminateState: Boolean,
    isStateUpdatable: Boolean,
    action: String,
    nextState: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkFlowApproval", workflowApprovalSchema);
