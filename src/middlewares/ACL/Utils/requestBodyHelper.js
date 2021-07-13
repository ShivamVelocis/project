const updateACLResBody = (rawBody, role) => {
  console.log(rawBody);
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

module.exports = { updateACLResBody, addACLReqBody };
