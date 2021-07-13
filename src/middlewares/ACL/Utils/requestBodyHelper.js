const resturctureResBody = (rawBody,role) => {
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
  aclData = { allowedResources, denyResources, role:role };
  return aclData;
};

module.exports = { resturctureResBody };
