const lodash = require("lodash");
const aclModel = require("../models/aclModel");

//-----------------------------db connection start-------------------------------//

// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/Vel", {
//   useNewUrlParser: "true",
//   useUnifiedTopology: true,
// });
// mongoose.connection.on("error", (err) => {
//   console.log("> err", err);
// });
// mongoose.connection.on("connected", (err, res) => {
//   console.log("> Database is connected");
// });

// -------------------------------db connect end-------------------------------

// -----------------------------------check allowed resources start----------------
/**
 * check resource user want to access.
 * @param {Array} resource List of resources allowed.
 * @param {string} rawPath Resource user want to access.
 * @return {boolean} if allowed return True else False.
 */
const allowedResource = (resource, rawPath) => {
  if (resource.includes("/") && rawPath == "/") {
    return true;
  }
  let path =
    rawPath.substring(rawPath.length - 1) == "/"
      ? rawPath.slice(0, rawPath.length - 1)
      : rawPath;
  let pathArray = path.split("/");
  let i = 1;
  let subPath = pathArray[1];

  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.filter(resource, lodash.matches(astrikPath)).length > 0) {
      console.log(astrikPath);
      return true;
    }
    i++;
    subPath = subPath + "/" + pathArray[i];
  }
  i = 1;
  subPath = pathArray[1];
  while (pathArray.length > i) {
    subPath = subPath + "/";
    if (lodash.filter(resource, lodash.matches(subPath)).length > 0) {
      return true;
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return false;
};

// -----------------------------------check allowed resources end----------------

// -----------------------------------check allowed methods start----------------
/**
 * check resource user want to access.
 * @param {Array} action List of methods allowed.
 * @param {string} userAction Method user want to access.
 * @return {boolean} if allowed return True else False.
 */
const allowedActions = (action, userAction) => {
  if (lodash.filter(action, lodash.matches(userAction)).length > 0) {
    return true;
  }
  return false;
};
// -----------------------------------check allowed methods end----------------

// -----------------------------------check deny resources start----------------
/**
 * check resource user want to access.
 * @param {Array} resource List of resources not allowed.
 * @param {string} rawPath Resource user want to access.
 * @return {boolean} if allowed return False else True.
 */
const denyResource = (resource, rawPath) => {
  if (resource.includes("/") && rawPath == "/") {
    return false;
  }
  let path =
    rawPath.substring(rawPath.length - 1) == "/"
      ? rawPath.slice(0, rawPath.length - 1)
      : rawPath;
  let pathArray = path.split("/");
  let i = 1;
  let subPath = pathArray[1];
  while (pathArray.length > i) {
    astrikPath = subPath + "/*";
    if (lodash.filter(resource, lodash.matches(astrikPath)).length > 0) {
      return false;
    }
    i++;
    subPath = subPath + "/" + pathArray[i];
  }
  i = 1;
  subPath = pathArray[1];
  while (pathArray.length > i) {
    subPath = subPath + "/";
    if (lodash.filter(resource, lodash.matches(subPath)).length > 0) {
      return false;
    }
    i++;
    subPath = subPath + pathArray[i];
  }
  return true;
};
// -----------------------------------check deny resources end----------------

// -----------------------------------check deny methods start----------------
/**
 * check method user want to access.
 * @param {Array} action List of actions not allowed to role.
 * @param {string} userAction Methods user want to access.
 * @return {boolean} if deny return False else True.
 */
const denyActions = (action, userAction) => {
  if (lodash.filter(action, lodash.matches(userAction)).length > 0) {
    return false;
  }
  return true;
};
// -----------------------------------check deny resources end----------------

const isPermitted = async (req, res, next) => {
  // fetching data from db of particuler role

  let userRole = res.locals.userRole;
  // console.log(userRole)
  let dbRoleData = await aclModel.findOne({ role: userRole });

  // calling methods to valid user role to respective resource and method
  let isAllowed =
    allowedResource(dbRoleData.allowedResources, req.originalUrl) &&
    allowedActions(dbRoleData.allowedMethods, req.method) &&
    denyResource(dbRoleData.denyResources, req.originalUrl) &&
    denyActions(dbRoleData.denyMethods, req.method);
  console.log(isAllowed);
  // if (isAllowed) next();

  // console.log(isAllowed);
  // console.log(req.headers.referer)
  // res.redirect(req.headers.referer);
};

module.exports = { isPermitted };
