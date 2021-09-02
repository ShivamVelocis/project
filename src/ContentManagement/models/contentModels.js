let mongoose = require("mongoose");

let contentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content_status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
