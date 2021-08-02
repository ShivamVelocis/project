const CONFIG = require("../configs/config");
const lodash = require("lodash");




// Resturcture requestbody data  //Common function
const addACLReqBody = (rawBody) => {
  //   addACLRulRequestBodyValidator(rawBody);
  let aclData = {};
  let allowedResources = [];
  let denyResources = [];
  for (const [key, value] of Object.entries(rawBody)) {
    let i = key.split("").pop();
    let methods = [];
    let path = "";

    if (key.startsWith("resource") && value) {
      path = value.toLowerCase();
      if (Array.isArray(rawBody[`methods${i}`])) {
        methods = rawBody[`methods${i}`];
      } else {
        methods.push(rawBody[`methods${i}`]);
      }
      if (rawBody["status"] == "allowedResources") {
        allowedResources.push({ path, methods });
      } else {
        denyResources.push({ path, methods });
      }
    }
  }
  aclData = { allowedResources, denyResources, role: rawBody["role"] };
  return aclData;
};

// for updating rules
const appendACL = (dbData, newData) => {
  let x = 0;
  let y = 0;
  let newObj = {};
  let reqData = newData;
  let newAllowedResources = [...reqData.allowedResources];
  let newDenyResources = [...reqData.denyResources];
  let reqDataAllowedPathArray = reqData.allowedResources.map((req) => req.path);
  let reqDataDenyPathArray = reqData.denyResources.map((req) => req.path);
  dbData.allowedResources.map((allowedResource, index) => {
    if (!reqDataAllowedPathArray.includes(allowedResource.path)) {
      newAllowedResources.push(allowedResource);
    } else if (
      reqDataAllowedPathArray.includes(allowedResource.path) &&
      !lodash.isEqual(
        allowedResource.methods,
        newAllowedResources[index].methods
      )
    ) {
      //no code in this condition
    } else {
      x++;
    }
  });
  dbData.denyResources.map((denyResource, index) => {
    if (!reqDataDenyPathArray.includes(denyResource.path)) {
      newDenyResources.push(denyResource);
    } else if (
      reqDataAllowedPathArray.includes(denyResource.path) &&
      !lodash.isEqual(denyResource.methods, newDenyResources[index].methods)
    ) {
      //no code in this condition
    } else {
      y++;
    }
  });



  if (
    x == reqDataAllowedPathArray.length &&
    y == reqDataDenyPathArray.length &&
    (reqDataAllowedPathArray.length > 0 || reqDataDenyPathArray.length > 0)
  ) {
    throw new Error(CONFIG.RULE_ALREADY_ADDED);
  }

  newObj.allowedResources = newAllowedResources;
  newObj.denyResources = newDenyResources;

  return newObj;
};

//request body validator
const addACLRulRequestBodyValidator = (reqBody) => {
  if (!reqBody["role"]) {
    throw new Error(CONFIG.ROLE_NOT_SELECTED);
  }
  if (!reqBody["status"]) {
    throw new Error("Please select Permission.");
  }
  for (const [key, value] of Object.entries(reqBody)) {
    if (key.startsWith("module") && !value) {
      throw new Error(CONFIG.MODULE_NOT_SELECTED);
    }
    if (key.startsWith("module") && value) {
      let i = key.split("").pop();
      if (!reqBody[`methods${i}`] && !reqBody[`resource${i}`]) {
        throw new Error(CONFIG.NO_RESOURCE_OR_METHOD);
      }
    }
  }
  return;
};

const updateACLRulRequestBodyValidator = (reqBody) => {
  for (const [key, value] of Object.entries(reqBody)) {
    if ((key.startsWith("resource") || key.startsWith("aresource")) && !value) {
      throw new Error(CONFIG.NO_RESOURCE_OR_METHOD);
    }
    if (key.startsWith("resource") && value) {
      let i = key.split("").pop();
      if (!reqBody[`methods${i}`]) {
        throw new Error(CONFIG.NO_RESOURCE_OR_METHOD);
      }
    }
    if (key.startsWith("dresource") && value) {
      let i = key.split("").pop();
      if (!reqBody[`dmethods${i}`]) {
        throw new Error(CONFIG.NO_RESOURCE_OR_METHOD);
      }
    }
  }
  return;
};

module.exports = { addACLReqBody, appendACL };
