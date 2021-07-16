const updateACLResBody = (rawBody) => {
  // console.log(rawBody);
  let aclData = {};
  let allowedResources = [];
  let denyResources = [];
  for (const [key, value] of Object.entries(rawBody)) {
    if (key.startsWith("resource") && value) {
      let methods = [];
      let path = "";
      let lastDigit = key.split("").pop();
      path = value;
      if (Array.isArray(rawBody[`methods${lastDigit}`])) {
        methods = rawBody[`methods${lastDigit}`];
      } else {
        methods.push(rawBody[`methods${lastDigit}`]);
      }

      allowedResources.push({ path, methods });
    }
    if (key.startsWith("dresource") && value) {
      let methods = [];
      let path = "";
      let lastDigit = key.split("").pop();
      path = value;
      if (Array.isArray(rawBody[`dmethods${lastDigit}`])) {
        methods = rawBody[`methods${lastDigit}`];
      } else {
        methods.push(rawBody[`dmethods${lastDigit}`]);
      }

      denyResources.push({ path, methods });
    }
  }
  aclData = { allowedResources, denyResources };
  return aclData;
};

const addACLReqBody = (rawBody) => {
  let aclData = {};
  let allowedResources = [];
  let denyResources = [];
  for (const [key, value] of Object.entries(rawBody)) {
    let methods = [];
    let path = "";
    if (key.startsWith("resource") && value) {
      let lastDigit = key.split("").pop();
      path = value;
      if (Array.isArray(rawBody[`methods${lastDigit}`])) {
        methods = rawBody[`methods${lastDigit}`];
      } else {
        methods.push(rawBody[`methods${lastDigit}`]);
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

const appendACL = (dbData, newData) => {
  let newObj = {};
  // console.log(dbData);
  // console.log(newData);
  let reqData = addACLReqBody(newData);
  let newAllowedResources = [...reqData.allowedResources];
  let newDenyResources = [...reqData.denyResources];
  let reqDataAllowedPathArray = reqData.allowedResources.map((req) => req.path);
  let reqDataDenyPathArray = reqData.denyResources.map((req) => req.path);
  dbData.allowedResources.map((allowedResource) => {
    if (!reqDataAllowedPathArray.includes(allowedResource.path)) {
      newAllowedResources.push(allowedResource);
    }
  });
  dbData.denyResources.map((denyResource) => {
    if (!reqDataDenyPathArray.includes(denyResource.path)) {
      newDenyResources.push(denyResource);
    }
  });

  // newObj.role = dbData.role;
  newObj.allowedResources = newAllowedResources;
  newObj.denyResources = newDenyResources;
  console.log(newObj);
  return newObj;
  // console.log(newAllowedResources)
  // console.log(newDenyResources)
};

module.exports = { updateACLResBody, addACLReqBody, appendACL };
