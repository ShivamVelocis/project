let mongoose = require("mongoose");

let contentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
