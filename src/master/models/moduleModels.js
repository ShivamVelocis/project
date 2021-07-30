let mongoose = require("mongoose");

let moduleSchema = new mongoose.Schema(
  {
    module_name: String,
    module_resources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
    module_status: Number,
  },
  { timestamps: true }
);

let moduleModel = mongoose.model("Module", moduleSchema);

module.exports = { moduleModel };
