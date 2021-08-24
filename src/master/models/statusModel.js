let mongoose = require("mongoose");

let statusSchema = new mongoose.Schema(
  {
    status_title: String,
    status: Number,
  },
  { timestamps: true }
);

let statusModel = mongoose.model("Status", statusSchema);

module.exports = { statusModel };
