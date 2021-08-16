const lodash = require("lodash");


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

module.exports = { allowedResource, denyResource };