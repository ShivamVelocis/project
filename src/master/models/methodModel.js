const mongoose = require("mongoose");

let methodSchema = new mongoose.Schema(
  {
    method_name: String,
    method_type: String,
    method_status: Number,
  },
  { timestamps: true }
);

let methodModel = mongoose.model("Method", methodSchema);

module.exports = { methodModel };
