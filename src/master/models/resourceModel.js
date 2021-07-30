let mongoose = require("mongoose");

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

module.exports = { resourceModel };
