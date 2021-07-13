const resturctureResBody = (rawBody, role) => {
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

module.exports = { resturctureResBody };
