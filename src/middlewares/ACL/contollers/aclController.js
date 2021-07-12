const aclModel = require("../models/aclModel");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    console.log(result)
    return res.render("middlewares/acl/views/view", {
      title: "ACL rule",
      module_title: "ACL Mangement",
      results: result,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    let result = await aclModel.find();
    // console.log(result)
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const addACl = async (req, res, next) => {
  try {
    return res.render("middlewares/ACL/views/add", {
      title: "Add ACL rule",
      module_title: "ACL Mangement",
      results: null,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const postAddACl = async (req, res, next) => {
  let aclData = {};
  let allowedResources = [];
  let denyResources = [];

  try {
    for (const [key, value] of Object.entries(req.body)) {
      let methods = [];
      let path = "";
      if (key.startsWith("resource")) {
        let lastDigit = key.split("").pop();
        path = value;
        if (Array.isArray(req.body[`methods${lastDigit}`])) {
          methods = req.body[`methods${lastDigit}`];
        } else {
          methods.push(req.body[`methods${lastDigit}`]);
        }
        if (req.body["status"] == "allowedResources") {
          allowedResources.push({ path, methods });
        } else {
          denyResources.push({ path, methods });
        }
      }
    }
    aclData = { allowedResources, denyResources, role: req.body["role"] };
    let acl = new aclModel(aclData);
    await acl.save();
    res.send("added");
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postEditACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  console.log(aclData);
  try {
    await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    res.send("Updated");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const postDeletACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    res.send("Deleted");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

module.exports = {
  postAddACl,
  postEditACl,
  postDeletACl,
  getAcls,
  getAcl,
  addACl,
};
