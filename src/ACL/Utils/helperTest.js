const lodash = require("lodash");
/**
 * Return acl data of all children acls.
 * @param {String} role User role.
 * @param {Array} data All acl rules data.
 * @return {Object} Returns allowedResources and deniedResources.
 */
const extractAclSubRolesData = (role, data) => {
  let children = [];

  // extract data of current role
  let currentRoleAclData = lodash.find(data, ["role", role]);

  // push current acl role data into arrays
  children.push(...currentRoleAclData.children);

  // return acl data of child and child of child
  let childResourcesData = childrenResources(data, children);

  // return acl data of of child which contain current user role in parentRole array
  let parentResourcesData = childrenResourcesAsParent(data, role);
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
const childrenResourcesAsParent = (aclData, role) => {
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

// /**
//  * Return acl data of child acls where role is in parent of other acls.
//  * @param {Array} aclData Acl rule data.
//  * @param {String} role Children of user role acl
//  * @return {Object} Returns allowedResources and deniedResources.
//  */
// const childrenResourcesAsParent = (aclData, role) => {
//   let parents = [role];
//   let allowedResources = [];
//   let denyResources = [];
//   let data = aclData;

//   while (whileLoopCheck(data, parents)) {
//     data.filter((item) => {
//       if (arrayMatch(item.childOf, parents)) {
//         allowedResources.push(...item.allowedResources);
//         denyResources.push(...item.denyResources);
//         let childrenResourcesData = childrenResources(data, item.children);
//         //
//         allowedResources.push(...childrenResourcesData.allowedResources);
//         denyResources.push(...childrenResourcesData.denyResources);
//         lodash.pull(data, item);
//         // parents.push(...item.childOf);
//         // lodash.uniq(parents);
//       }
//     });
//   }
//   return { allowedResources, denyResources };
// };

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

module.exports = { extractAclSubRolesData };
