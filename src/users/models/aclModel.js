let mongoose = require("mongoose");

let aclSchema = new mongoose.Schema(
  {
   role:String,
   allowedResources:[Object],
   denyResources:[Object],
  },
  { timestamps: true }
);

module.exports = mongoose.model("acl", aclSchema);
