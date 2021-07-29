const responseHandler = (
  statu = false,
  message = "",
  data = null,
  accesstoken = null,
  refreshtoken = null
) => {
  let obj = {};
  obj.statu = statu;
  obj.message = message;
  if (data) {
    obj.data = data;
  }
  obj.accesstoken = accesstoken;
  if (refreshtoken) {
    obj.refreshtoken = refreshtoken;
  }

  return obj;
};

module.exports = { responseHandler };
