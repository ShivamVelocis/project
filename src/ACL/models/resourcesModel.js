let mongoose = require("mongoose");

let resourcesSchema = new mongoose.Schema(
  {
    module_name: String,
    resources: [
      {
        resource_name: { type: String },
        resource_path: { type: String },
        resource_status: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourcesSchema);
