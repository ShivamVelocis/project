const lodash = require("lodash");

// remove the falsy values from object 
const cleanObject = function (obj) {
  return lodash.transform(obj, function (object, value, key) {
    if (value && typeof value === "object") {
      object[key] = cleanObject(value);
    } else if (value) {
      object[key] = value;
    }
  });
};

module.exports = cleanObject;
