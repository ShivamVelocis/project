let mongoose = require("mongoose");

let contentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content_status: { type: Number, default: 0 },
    content_State: { type: String, default: "INITIATE" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
