// restructure update acl rule request body data
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
      path = value.toLowerCase();
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
      path = value.toLowerCase();
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

// Resturcture requestbody data  //Common function
const addACLReqBody = (rawBody) => {
  requestBodyValidator(rawBody);
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

// Append data to db data and create new object for add rule
const appendACL = (dbData, newData) => {
  let x = 0;
  let y = 0;
  let newObj = {};
  let reqData = addACLReqBody(newData);
  let newAllowedResources = [...reqData.allowedResources];
  let newDenyResources = [...reqData.denyResources];
  let reqDataAllowedPathArray = reqData.allowedResources.map((req) => req.path);
  let reqDataDenyPathArray = reqData.denyResources.map((req) => req.path);
  dbData.allowedResources.map((allowedResource) => {
    if (!reqDataAllowedPathArray.includes(allowedResource.path)) {
      newAllowedResources.push(allowedResource);
    } else {
      x++;
    }
  });
  dbData.denyResources.map((denyResource) => {
    if (!reqDataDenyPathArray.includes(denyResource.path)) {
      newDenyResources.push(denyResource);
    } else {
      y++;
    }
  });

  if (
    x == reqDataAllowedPathArray.length &&
    reqDataAllowedPathArray.length > 0 &&
    reqDataDenyPathArray.length > 0 &&
    y == reqDataDenyPathArray.length
  ) {
    throw new Error("Rule already present in db");
  }

  newObj.allowedResources = newAllowedResources;
  newObj.denyResources = newDenyResources;
  console.log(newObj);
  return newObj;
};

//request body validator
const requestBodyValidator = (reqBody) => {
  if (!reqBody["role"]) {
    throw new Error("Please select role name.");
  }
  if (!reqBody["status"]) {
    throw new Error("Please select Permission.");
  }
  for (const [key, value] of Object.entries(reqBody)) {
    if (key.startsWith("module") && !value) {
      throw new Error("Please select atleast a Module");
    }
    if (key.startsWith("module") && value) {
      let i = key.split("").pop();
      if (!reqBody[`methods${i}`] && !reqBody[`resource${i}`]) {
        throw new Error("Please select resource/method for selected Module(s)");
      }
    }
  }
  return;
};

module.exports = { updateACLResBody, addACLReqBody, appendACL };
