const updateACLResBody = (rawBody, role) => {
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
      if (Array.isArray(rawBody[`methods${lastDigit}`])) {
        methods = rawBody[`methods${lastDigit}`];
      } else {
        methods.push(rawBody[`methods${lastDigit}`]);
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
  console.log(dbData);
  console.log(newData);
  let reqData = addACLReqBody(newData);
  let newAllowedResource = [...reqData.allowedResources];
  let newDenyResource = [...reqData.denyResources];
  let reqDataAllowedPathArray = reqData.allowedResources.map((req) => req.path);
  let reqDataDenyPathArray = reqData.denyResources.map((req) => req.path);
  dbData.allowedResources.map((allowedResource) => {
    if (!reqDataAllowedPathArray.includes(allowedResource.path)) {
      newAllowedResource.push(allowedResource);
    }
  });
  dbData.denyResources.map((denyResource) => {
    if (!reqDataDenyPathArray.includes(denyResource.path)) {
      newDenyResource.push(denyResource);
    }
  });

  // newObj.role = dbData.role;
  newObj.allowedResources = newAllowedResource;
  newObj.denyResources = newDenyResource;
  console.log(newObj);
  return newObj;
  // console.log(newAllowedResource)
  // console.log(newDenyResource)
};

module.exports = { updateACLResBody, addACLReqBody, appendACL };
