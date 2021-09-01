const lodash = require("lodash");
const aclModel = require("../models/aclModel");
const aclHelper = require("../Utils/aclHelper");

/**
 * Middleware
 * check if user allowed to access requested uri based on user role available in req.userRole
 */
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
  // console.log('aclData: ', aclData);

  if (
    aclData &&
    aclData.length &&
    lodash.find(aclData, ["role", req.userRole])
  ) {
    dbRoleData = aclHelper.extractResourcesFromAcls(req.userRole, aclData);
    // console.log("dbRoleData: ", dbRoleData);
  }

  let isAllowed = false;
  if (req.userRole && dbRoleData) {
    // console.log("dbRoleData: ", dbRoleData);
    let allowedResources = dbRoleData.allowedResources.map((resource) => {
      // console.log("resource: ", resource);
      return { path: resource.resource_path, methods: resource.methods };
    });
    let denyResources = dbRoleData.denyResources.map((resource) => {
      return { path: resource.resource_path, methods: resource.methods };
    });
    console.log(
      aclHelper.allowedResource(allowedResources, req.originalUrl, req.method)
    );
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
