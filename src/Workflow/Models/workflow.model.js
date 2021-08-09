const mongoose = require("mongoose");

let WorkflowSchema = new mongoose.Schema(
  {
    Module: String,
    States: [
      {
        _id: false,
        state: String,
        contentStatus: String,
        isStartState: Boolean,
        isTerminateState: Boolean,
        isStateUpdatable: Boolean,
        actions: [
          {
            _id: false,
            action: String,
            nextState: String,
            role: [String],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workflow", WorkflowSchema);
