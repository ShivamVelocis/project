const aclModel = require("../models/aclModel");
const { resturctureResBody } = require("../Utils/requestBodyHelper");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    // console.log(result);
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
    return res.render("middlewares/ACL/views/list", {
      title: "ACL Rules",
      module_title: "ACL Mangement",
      results: result,
    });
    // res.send(result);
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
      if (key.startsWith("resource") && value) {
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
    req.flash("success","ACL RULE added successfully")
    res.redirect('/acl/')
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const editACl = async (req, res, next) => {
  aclId = req.params.id;

  try {
    let result = await aclModel.findById(aclId);
    return res.render("middlewares/ACL/views/edit", {
      title: "Edit ACL Rule",
      module_title: "ACL Mangement",
      results: result,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const postEditACl = async (req, res, next) => {
  aclId = req.params.id;

  try {
    let aclDbData = await aclModel.findById(aclId)
    aclData = resturctureResBody(req.body,aclDbData.role);
    await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    req.flash("success","ACL RULE updated successfully")
    res.redirect('/acl/')
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
    req.flash("success","ACL RULE deleted successfully")
    res.redirect('/acl/')
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
  editACl,
};
