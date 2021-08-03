let mongoose = require("mongoose");

let aclSchema = new mongoose.Schema(
  {
    role: String,
    allowedResources: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
    ],
    denyResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "Resource" }],
  },
  { timestamps: true }
);
aclSchema.statics.findAclByResource = function (resourceId, cb) {
  let id = Array.isArray(resourceId) ? resourceId : [resourceId];
  return this.find({
    $or: [{ allowedResources: { $in: id } }, { denyResources: { $in: id } }],
  }).exec(cb);
};
module.exports = mongoose.model("acl", aclSchema);
