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

let resourceSchema = new mongoose.Schema(
  {
    resource_name: String,
    resource_path: String,
    resource_status: Number,
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    methods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Method" }],
  },
  { timestamps: true }
);

let resourceModel = mongoose.model("Resource", resourceSchema);

let methodSchema = new mongoose.Schema(
  {
    method_name: String,
    method_type: String,
    method_status: Number,
  },
  { timestamps: true }
);

let methodModel = mongoose.model("Method", methodSchema);

module.exports = { moduleModel, resourceModel, methodModel };
