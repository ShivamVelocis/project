const mongoose = require("mongoose");

let ApprovalSchema = new mongoose.Schema(
  {
    comment: { type: String, default: null },
    level: { type: Number, required: true },
    updatedBy: { type: String, required: true },
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    module: { type: String, required: true, lowercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("approval", ApprovalSchema);
