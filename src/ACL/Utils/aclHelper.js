const lodash = require("lodash");
// const log = console.log;
// const { all } = require("../Routes/aclRoutes");

const filterCallback = (key, value) => {
  return function (data) {
    return data[key] == value;
  };
};

const isMethodAllowed = (data, method) => {
  return data.some((item) => {
    return item.methods.includes(method);
  });
};

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
  if (lodash.find(resource, ["path", resourceToBeAccess])) {
    console.log("resourceToBeAccess: ", resourceToBeAccess);
    let isAllowed = isMethodAllowed(
      resource.filter(filterCallback("path", resourceToBeAccess)),
      method
    );
    if (isAllowed) {
      return true;
    }
  }
  // if (lodash.find(resource, ["path", "/*"])) {
  if (lodash.find(resource, filterCallback("path", "/*"))) {
    let isAllowed = isMethodAllowed(
      resource.filter(filterCallback("path", "/*")),
      method
    );
    if (isAllowed) {
      return true;
    }
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
      let isAllowed = isMethodAllowed(
        resource.filter(filterCallback("path", astrikPath)),
        method
      );
      if (isAllowed) {
        return true;
      }
    }
    i++;
    subPath = subPath + "/" + pathArray[i];
  }
  i = 0;
  subPath = pathArray[0];
  while (pathArray.length > i) {
    subPath = subPath + "/";
    // console.log('subPath: ', subPath);
    if (lodash.find(resource, ["path", subPath])) {
      let isAllowed = isMethodAllowed(
        resource.filter(filterCallback("path", subPath)),
        method
      );
      if (isAllowed) {
        return true;
      }
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

/**
 * Return acl data of child acls.
 * @param {String} role User role.
 * @param {Array} data All acl rules data.
 * @return {Object} Returns allowedResources and deniedResources.
 */
const extractAclSubRolesData = (role, data) => {
  let children = [];
  let allowedResources = [];
  let denyResources = [];

  // extract data of current role
  let currentRoleAclData = lodash.find(data, ["role", role]);
  // console.log('currentRoleAclData: ', currentRoleAclData);

  // push current acl role data into arrays
  children.push(...currentRoleAclData.children);
  // console.log('children: ', children);
  allowedResources.push(...currentRoleAclData.allowedResources);
  denyResources.push(...currentRoleAclData.denyResources);

  // remove current acl data from list
  // data = lodash.pull(data, currentRoleAclData);

  // return acl data of child and child of child
  let childResourcesData = childrenResources(data, children);

  // return acl data of of child which contain current user role in parentRole array
  let parentResourcesData = resourceThroughParent(data, role);

  // concat resources from return data of above two function
  childResourcesData.allowedResources.push(
    ...parentResourcesData.allowedResources
  );
  childResourcesData.denyResources.push(...parentResourcesData.denyResources);

  // concat role resources
  childResourcesData.allowedResources.push(...allowedResources);
  childResourcesData.denyResources.push(...denyResources);

  // log(childResourcesData);
  // console.log(childResourcesData);
  return { ...childResourcesData };
};

let childrenResources = (aclData, firstChildData) => {
  // console.log('firstChildData: ', firstChildData);
  let children = [];
  let allowedResources = [];
  let denyResources = [];

  children.push(...firstChildData);

  aclData.map((acl) => {
    if (children.includes(acl.role) && acl.aclStatus) {
      children.push(...acl.children);
      allowedResources.push(...acl.allowedResources);
      denyResources.push(...acl.denyResources);
    }
    lodash.uniq(children);
    return;
  });

  lodash.uniq(allowedResources);
  lodash.uniq(denyResources);
  // console.log(allowedResources)
  return { allowedResources, denyResources };
};

const resourceThroughParent = (aclData, role) => {
  // console.log("resourceThroughParent: ", role);

  let parents = [role];
  let allowedResources = [];
  let denyResources = [];
  let data = aclData;

  while (whileLoopCheck(data, parents)) {
    data.filter((item) => {
      if (arrayMatch(item.parents, parents)) {
        allowedResources.push(...item.allowedResources);
        denyResources.push(...item.denyResources);
        let childrenResourcesData = childrenResources(data, item.children);
        // console.log('childrenResourcesData: ', childrenResourcesData);
        allowedResources.push(...childrenResourcesData.allowedResources);
        denyResources.push(...childrenResourcesData.denyResources);
        lodash.pull(data, item);
        parents.push(...item.parents);
        lodash.uniq(parents);
      }
    });
  }
  // console.log("asd", allowedResources, denyResources);
  // console.log(parents);

  return { allowedResources, denyResources };
};

const arrayMatch = (arr1, arr2) => {
  return arr1.some((data) => arr2.includes(data));
};

const whileLoopCheck = (data, roleInParent) => {
  return data.some((data) => {
    return arrayMatch(data.parents, roleInParent);
  });
};

module.exports = { allowedResource, denyResource, extractAclSubRolesData };
