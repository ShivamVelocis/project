let mongoose = require("mongoose");

let resourcesSchema = new mongoose.Schema(
  {
    module_name: String,
    resources: [
      {
        resource_name: String,
        resource_path: String,
        resource_status: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourcesSchema);
