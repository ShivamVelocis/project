let mongoose = require("mongoose");

let aclSchema = new mongoose.Schema(
  {
    role: String,
    allowedResources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
    denyResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("acl", aclSchema);
