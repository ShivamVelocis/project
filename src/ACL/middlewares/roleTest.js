const lodash = require("lodash");
const aclModel = require("../models/aclModel");
const CONFIG = require("../configs/config");

// -----------------------------------check allowed resources start--------------
/**
/**
 * check resource user want to access.
 * @param {Array} resource List of resources allowed.
 * @param {string} resourceToBeAccess Resource user want to access.
 * @param {string} method Request method user want to access.
 * @return {boolean} if allowed return True else False.
 */
const allowedResource = (resource, resourceToBeAccess, method) => {
  // console.log(resource, resourceToBeAccess,method)
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", resourceToBeAccess])) {
    resourcePathIndex = lodash.findIndex(resource, [
      "path",
      resourceToBeAccess,
    ]);
    allowedMethods = resource[resourcePathIndex].methods;
    isMethodsAllowed = allowedMethods.includes(method);
    return isMethodsAllowed;
  }
  if (lodash.find(resource, ["path", "/*"])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", "/*"]);
    allowedMethods = resource[resourcePathIndex].methods;
    isMethodsAllowed = allowedMethods.includes(method);
    return isMethodsAllowed;
  }
  let path =
    resourceToBeAccess.substring(resourceToBeAccess.length - 1) == "/"
      ? resourceToBeAccess.slice(0, resourceToBeAccess.length - 1)
      : resourceToBeAccess;
  let pathArray = lodash.remove(path.split("/"), (n) => !!n);
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      allowedMethods = resource[resourcePathIndex].methods;
      return allowedMethods.includes(method);
    }
    i++;
    subPath = subPath + "/" + pathArray[i];
  }
  i = 0;
  subPath = pathArray[0];
  while (pathArray.length > i) {
    subPath = subPath + "/";
    if (lodash.find(resource, ["path", subPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", subPath]);
      allowedMethods = resource[resourcePathIndex].methods;
      return allowedMethods.includes(method);
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return false;
};

// -----------------------------------check allowed resources end----------------

// -----------------------------------check deny resources start-----------------
/**
 * check resource user want to access.
 * @param {Array} resource List of resources deny.
 * @param {string} resourceToBeAccess Resource user want to access.
 * @param {string} method Request method user want to access.
 * @return {boolean} if deny return True else False.
 */
const denyResource = (resource, resourceToBeAccess, method) => {
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", resourceToBeAccess])) {
    resourcePathIndex = lodash.findIndex(resource, [
      "path",
      resourceToBeAccess,
    ]);
    deniedMethods = resource[resourcePathIndex].methods;
    isMethodDenied = deniedMethods.includes(method);
    return !isMethodDenied;
  }
  if (lodash.find(resource, ["path", "/*"])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", "/*"]);
    deniedMethods = resource[resourcePathIndex].methods;
    isMethodDenied = deniedMethods.includes(method);
    return !isMethodDenied;
  }
  let path =
    resourceToBeAccess.substring(resourceToBeAccess.length - 1) == "/"
      ? resourceToBeAccess.slice(0, resourceToBeAccess.length - 1)
      : resourceToBeAccess;
  let pathArray = lodash.remove(path.split("/"), (n) => !!n);
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      deniedMethods = resource[resourcePathIndex].methods;
      return !deniedMethods.includes(method);
    }
    i++;
    subPath = subPath + "/" + pathArray[i];
  }
  i = 0;
  subPath = pathArray[0];
  while (pathArray.length > i) {
    subPath = subPath + "/";
    if (lodash.find(resource, ["path", subPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", subPath]);
      deniedMethods = resource[resourcePathIndex].methods;
      return !deniedMethods.includes(method);
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return true;
};

// -----------------------------------check deny resources end-------------------

// Middleware
const isPermitted = async (req, res, next) => {
  // fetching data from db of particuler role
  // console.log(req.originalUrl)
  let userRole = res.locals.userRole;
  let dbRoleData = await aclModel
    .findOne({ role: userRole })
    .populate({
      path: "allowedResources",
      select: { module: 0, __v: 0 },
      populate: {
        path: "methods",
        select: { __v: 0 },
      },
    })
    .populate({
      path: "denyResources",
      select: { module: 0, __v: 0 },
      populate: {
        path: "methods",
        select: { __v: 0 },
      },
    });

  let isAllowed = false;
  if (userRole && dbRoleData) {
    let allowedResources = dbRoleData.allowedResources.map((resource) => {
      let path = resource.resource_path;
      let methods = resource.methods.map((method) => method.method_type);
      return { path, methods };
    });
    let denyResources = dbRoleData.denyResources.map((resource) => {
      let path = resource.resource_path;
      let methods = resource.methods.map((method) => method.method_type);
      return { path, methods };
    });
    isAllowed =
      allowedResource(allowedResources, req.originalUrl, req.method) &&
      denyResource(denyResources, req.originalUrl, req.method);
      console.log(allowedResources)
  }

  if (isAllowed) return next();
  return res.json({
    success: false,
    error: "Not Authorized",
    data: null,
    accesstoken: req.accesstoken,
  });
};

module.exports = { isPermitted };
