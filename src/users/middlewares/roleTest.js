const lodash = require("lodash");
const aclModel = require("../models/aclModel");


// -----------------------------------check allowed resources start----------------
/**
/**
 * check resource user want to access.
 * @param {Array} resource List of resources allowed.
 * @param {string} rawPath Resource user want to access.
 * @param {string} method Request method user want to access.
 * @return {boolean} if allowed return True else False.
 */
 const allowedResource = (resource, rawPath,method) => {
  // console.log(resource, rawPath,method)
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", rawPath])) {
    console.log("test allowed")
    resourcePathIndex = lodash.findIndex(resource, ["path", rawPath]);
    dbMethods = resource[resourcePathIndex].methods
    allowedMethods = dbMethods.includes(method)
    return allowedMethods;
  }
  let path = rawPath.substring(rawPath.length - 1) == "/" ? rawPath.slice(0, rawPath.length - 1) : rawPath;
  let pathArray = lodash.remove(path.split("/"), n=>!!n);
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      dbMethods = resource[resourcePathIndex].methods
      return dbMethods.includes(method);
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
      dbMethods = resource[resourcePathIndex].methods
      dbMethods = resource[resourcePathIndex].methods
      return dbMethods.includes(method);
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return false;
};

// -----------------------------------check allowed resources end----------------

// -----------------------------------check allowed resources start----------------
/**
 * check resource user want to access.
 * @param {Array} resource List of resources allowed.
 * @param {string} rawPath Resource user want to access.
 * @param {string} method Request method user want to access.
 * @return {boolean} if allowed return True else False.
 */
 const denyResource = (resource, rawPath,method) => {
  console.log(resource, rawPath,method)
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", rawPath])) {
    console.log("test deny")
    resourcePathIndex = lodash.findIndex(resource, ["path", rawPath]);
    dbMethods = resource[resourcePathIndex].methods
    denyMethods = dbMethods.includes(method)
    return !denyMethods;
  }
  let path = rawPath.substring(rawPath.length - 1) == "/" ? rawPath.slice(0, rawPath.length - 1) : rawPath;
  let pathArray = lodash.remove(path.split("/"), n=>!!n);;
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      dbMethods = resource[resourcePathIndex].methods
      return !dbMethods.includes(method);
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
      dbMethods = resource[resourcePathIndex].methods
      dbMethods = resource[resourcePathIndex].methods
      return !dbMethods.includes(method);
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return true;
};

// -----------------------------------check allowed resources end----------------
const isPermitted = async (req, res, next) => {
  // fetching data from db of particuler role

  let userRole = res.locals.userRole;
  let dbRoleData = await aclModel.findOne({ role: userRole });
  // console.log(dbRoleData)
  console.log(
    allowedResource(dbRoleData.allowedResources, req.originalUrl,req.method),
    denyResource(dbRoleData.denyResources, req.originalUrl,req.method),
   
  );

  let isAllowed =
    allowedResource(dbRoleData.allowedResources, req.originalUrl,req.method) &&
    denyResource(dbRoleData.denyResources, req.originalUrl,req.method)
  // console.log(isAllowed);
  if (isAllowed) res.send("authorized")
  else res.send("not authorized")

  // console.log(isAllowed);
  // console.log(req.headers.referer)
  // res.redirect(req.headers.referer);
};

module.exports = { isPermitted };
