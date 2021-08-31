const mongoose = require("mongoose");

let WorkflowSchema = new mongoose.Schema(
  {
    module: { type: String, required: true, lowercase: true },
    states: [
      {
        _id: false,
        wfLevel: { type: Number, required: true },
        wfLevelName: { type: String, required: true },
        wfRole: [{ type: String }],
        wfNextActions: [{ _id: false, nextAction: { type: Number } }],
      },
    ],
  },
  { timestamps: true }
);

WorkflowSchema.pre("save", async function (next) {
  let data = await this.constructor.findOne({ module: this.module });
  if (data) {
    next(new Error("Worfkflow already available for this Module"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Workflow", WorkflowSchema);

// 0-drafted
// 1-initiated
// 2-approval approved
// 3-publisher approved
// 4-Approved
// 5-rejected
