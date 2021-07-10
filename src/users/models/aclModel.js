let mongoose = require("mongoose");

let aclSchema = new mongoose.Schema(
  {
   role:String,
   allowedResources:[String],
   denyResources:[String],
   allowedMethods:[String],
   denyMethods:[String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("acl", aclSchema);
