const lodash = require("lodash");
const aclModel = require("../models/aclModel");
const aclHelper = require("../utils/aclHelper");

// Middleware
const isPermitted = async (req, res, next) => {
  let dbRoleData;
  let aclData = await aclModel
    .find({ aclStatus: 1 })
    .populate({
      path: "allowedResources",
      match: { resource_status: 1 },
      select: { module: 0, __v: 0 },
    })
    .populate({
      path: "denyResources",
      match: { resource_status: 1 },
      select: { module: 0, __v: 0 },
    });

  if (
    aclData &&
    aclData.length &&
    lodash.find(aclData, ["role", req.userRole])
  ) {
    dbRoleData = aclHelper.extractAclSubRolesData(req.userRole, aclData);
  }

  let isAllowed = false;
  if (req.userRole && dbRoleData) {
    let allowedResources = dbRoleData.allowedResources.map((resource) => {
      return { path: resource.resource_path, methods: resource.methods };
    });
    let denyResources = dbRoleData.denyResources.map((resource) => {
      return { path: resource.resource_path, methods: resource.methods };
    });
    isAllowed =
      aclHelper.allowedResource(
        allowedResources,
        req.originalUrl,
        req.method
      ) && aclHelper.denyResource(denyResources, req.originalUrl, req.method);
  }

  if (isAllowed) return next();
  res.status(401);
  res.json({
    success: false,
    error: "Not Authorized",
    data: null,
    accesstoken: req.accesstoken,
  });
};

const auth = () => {
  isPermitted.unless = require("express-unless");
  return isPermitted;
};

module.exports = { isPermitted, auth };
