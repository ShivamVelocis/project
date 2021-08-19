const aclModel = require("../models/aclModel");
const aclHelper = require("../Utils/aclHelper");

// Middleware
const isPermitted = async (req, res, next) => {
  // fetching data from db of particuler role
  // console.log(req.originalUrl);
  let userRole = req.userRole;
  let dbRoleData = await aclModel
    .findOne({ role : userRole })
    .populate({
      path: "allowedResources",
      select: { module: 0, __v: 0 },
    })
    .populate({
      path: "denyResources",
      select: { module: 0, __v: 0 },
    });

  let isAllowed = false;
  // console.log(dbRoleData)
  if (userRole && dbRoleData) {
    let allowedResources = dbRoleData.allowedResources.map((resource) => {
      return { path: resource.resource_path, methods: resource.methods };
    });
    let denyResources = dbRoleData.denyResources.map((resource) => {
      return { path: resource.resource_path, methods: resource.methods };
    });
    // console.log(allowedResources);
    isAllowed =
    aclHelper.allowedResource(allowedResources, req.originalUrl, req.method) &&
    aclHelper.denyResource(denyResources, req.originalUrl, req.method);
    // console.log(allowedResources, req.originalUrl, req.method);
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
