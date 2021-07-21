const lodash = require("lodash");
const aclModel = require("../models/aclModel");
const CONFIG = require("../configs/config");

// -----------------------------------check allowed resources start----------------
/**
/**
 * check resource user want to access.
 * @param {Array} resource List of resources allowed.
 * @param {string} rawPath Resource user want to access.
 * @param {string} method Request method user want to access.
 * @return {boolean} if allowed return True else False.
 */
const allowedResource = (resource, rawPath, method) => {
  // console.log(resource, rawPath,method)
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", rawPath])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", rawPath]);
    dbMethods = resource[resourcePathIndex].methods;
    allowedMethods = dbMethods.includes(method);
    return allowedMethods;
  }
  if (lodash.find(resource, ["path", "/*"])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", "/*"]);
    dbMethods = resource[resourcePathIndex].methods;
    allowedMethods = dbMethods.includes(method);
    return allowedMethods;
  }
  let path =
    rawPath.substring(rawPath.length - 1) == "/"
      ? rawPath.slice(0, rawPath.length - 1)
      : rawPath;
  let pathArray = lodash.remove(path.split("/"), (n) => !!n);
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      dbMethods = resource[resourcePathIndex].methods;
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
      dbMethods = resource[resourcePathIndex].methods;
      dbMethods = resource[resourcePathIndex].methods;
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
const denyResource = (resource, rawPath, method) => {
  let resourcePathIndex = null;
  if (lodash.find(resource, ["path", rawPath])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", rawPath]);
    dbMethods = resource[resourcePathIndex].methods;
    denyMethods = dbMethods.includes(method);
    return !denyMethods;
  }
  if (lodash.find(resource, ["path", "/*"])) {
    resourcePathIndex = lodash.findIndex(resource, ["path", "/*"]);
    dbMethods = resource[resourcePathIndex].methods;
    denyMethods = dbMethods.includes(method);
    return !denyMethods;
  }
  let path =
    rawPath.substring(rawPath.length - 1) == "/"
      ? rawPath.slice(0, rawPath.length - 1)
      : rawPath;
  let pathArray = lodash.remove(path.split("/"), (n) => !!n);
  let i = 0;
  let subPath = pathArray[0];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.find(resource, ["path", astrikPath])) {
      resourcePathIndex = lodash.findIndex(resource, ["path", astrikPath]);
      dbMethods = resource[resourcePathIndex].methods;
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
      dbMethods = resource[resourcePathIndex].methods;
      dbMethods = resource[resourcePathIndex].methods;
      return !dbMethods.includes(method);
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return true;
};

// -----------------------------------check allowed resources end----------------

// Middleware
const isPermitted = async (req, res, next) => {
  // fetching data from db of particuler role
  // console.log(req.originalUrl)
  let userRole = res.locals.userRole;
  let dbRoleData = await aclModel.findOne({ role: userRole });

  let isAllowed =
    allowedResource(dbRoleData.allowedResources, req.originalUrl, req.method) &&
    denyResource(dbRoleData.denyResources, req.originalUrl, req.method);

  if (isAllowed) return next();

  if (req.headers.referer && !req.headers.referer.endsWith(req.originalUrl)) {
    if (
      res.req.session.flash &&
      res.req.session.flash.error &&
      res.req.session.flash.error.includes(CONFIG.AUTH_FAIL_MESSAGE)
    ) {
      return res.redirect(req.headers.referer);
    }
    req.flash("error", CONFIG.AUTH_FAIL_MESSAGE);
    return res.redirect(req.headers.referer);
  } else {
    if (
      res.req.session.flash &&
      res.req.session.flash.error &&
      res.req.session.flash.error.includes(CONFIG.AUTH_FAIL_MESSAGE)
    ) {
      return res.redirect("/user/auth/login");
    }
    req.flash("error", CONFIG.AUTH_FAIL_MESSAGE);
    return res.redirect("/user/auth/login");
  }
};

module.exports = { isPermitted };
