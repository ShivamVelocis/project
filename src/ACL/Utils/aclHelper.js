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

/**
 * Return changed resource,Repalce {text} with corresponding value in resource to be access value.
 * @param {Array} allowedResources Resources allowed.
 * @param {Array} resourceToBeAccess Resource to bo accessed.
 * @return {Array} Returns Changed resource path.
 */
const changeResource = (allowedResources, resourceToBeAccess) => {
  let urlArray = lodash.remove(resourceToBeAccess.split("/"), (n) => !!n);
  return allowedResources.map((item) => {
    let pathArray = lodash.remove(item.path.split("/"), (n) => !!n);
    pathArray.map((item, index) => {
      if (/(^{).*(}$)/.test(item)) {
        pathArray[index] = urlArray[index] || item;
      }
    });
    let path = pathArray.join("/");
    console.log("pathArray: ", pathArray);
    return { path, methods: item.methods };
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
  if (lodash.find(resource, ["path", resourceToBeAccess])) {
    let isAllowed = isMethodAllowed(
      resource.filter(filterCallback("path", resourceToBeAccess)),
      method
    );
    if (isAllowed) {
      return true;
    }
  }
  if (lodash.find(resource, filterCallback("path", "/*"))) {
    let isAllowed = isMethodAllowed(
      resource.filter(filterCallback("path", "/*")),
      method
    );
    if (isAllowed) {
      return true;
    }
  }

  resource = changeResource(resource, resourceToBeAccess);

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

/**
 * Return acl data of all children acls.
 * @param {String} role User role.
 * @param {Array} data All acl rules data.
 * @return {Object} Returns allowedResources and deniedResources.
 */
const extractAclSubRulesData = (role, data) => {
  let children = [];

  // extract data of current role
  let currentRoleAclData = lodash.find(data, ["role", role]);
  // console.log('currentRoleAclData: ', currentRoleAclData);
  if (!!!currentRoleAclData) {
    // console.log("currentRoleAclData: ", !!!currentRoleAclData);
    return;
  }
  // push current acl role data into arrays
  children.push(...currentRoleAclData.children);

  // return acl data of child and child of child
  let childResourcesData = childrenResources(data, children);

  // return acl data of of child which contain current user role in parentRole array
  let parentResourcesData = childOfResources(data, role);
  childResourcesData.acls.push(
    ...parentResourcesData.acls.filter(Boolean),
    currentRoleAclData
  );

  return { ...childResourcesData };
};

/**
 * Return acl data of child acls.
 * @param {Array} aclData Acl rule data.
 * @param {Array} firstChildData Children of user role acl
 * @return {Object} Returns allowedResources and deniedResources.
 */
let childrenResources = (aclData, firstChildData) => {
  let children = [];
  let acls = [];

  children.push(...firstChildData);

  aclData.map((acl) => {
    if (children.includes(acl.role) && acl.aclStatus) {
      children.push(...acl.children);
      acls.push(acl);
    }
    lodash.uniq(children);
    return;
  });

  return { acls };
};

/**
 * Return acl data of child acls where role is in parent of other acls.
 * @param {Array} aclData Acl rule data.
 * @param {String} role Children of user role acl
 * @return {Object} Returns allowedResources and deniedResources.
 */
const childOfResources = (aclData, role) => {
  //   console.log("aclData, role: ", aclData, role);
  let parents = [role];
  let data = aclData;
  let acls = [];
  while (whileLoopCheck(data, parents)) {
    data.filter((item) => {
      if (arrayMatch(item.childOf, parents)) {
        acls.push(item);
        let childrenResourcesData = childrenResources(data, item.children);
        parents.push(item.role);
        acls.push(childrenResourcesData.acl);
        lodash.pull(data, item);
      }
    });
  }

  return { acls };
};

/**
 * Check if there is common elements between two array.
 * @param {Array} arr1 First array.
 * @param {Array} arr2 Second array
 * @return {Boolean} True if there is a least one element is coomon.
 */
const arrayMatch = (arr1, arr2) => {
  return arr1.some((data) => arr2.includes(data));
};

/**
 * Check if there is child in acl data.
 * @param {Array} data Array of acl rules.
 * @param {Array} roleInParent Role name in parent of acl rule
 * @return {Boolean} True if there is a role
 */
const whileLoopCheck = (data, roleInParent) => {
  //   console.log("data, roleInParent: ", data, roleInParent);
  return data.some((data) => {
    return arrayMatch(data.childOf, roleInParent);
  });
};

const extractResourcesFromAcls = (userRole, aclData) => {
  // console.log("data: ", data);
  let data = extractAclSubRulesData(userRole, aclData).acls;
  // console.log("data: ", data);
  if (!!!data) return;
  let allowedResources = [];
  let denyResources = [];
  data
    .map((acl) => {
      let newObj = {};
      if (
        (acl.allowedResources && acl.allowedResources.length) ||
        (acl.denyResources && acl.denyResources.length)
      ) {
        newObj.allowedResources = acl.allowedResources;
        newObj.denyResources = acl.denyResources;
      }
      return !lodash.isEmpty(newObj) ? newObj : null;
    })
    .filter(Boolean)
    .map((item) => {
      allowedResources.push(...item.allowedResources);
      denyResources.push(...item.denyResources);
    });
  return { allowedResources, denyResources };
};

module.exports = {
  allowedResource,
  extractAclSubRulesData,
  extractResourcesFromAcls,
};
