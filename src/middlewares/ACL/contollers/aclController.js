const rolemodel = require("../../../roleManagement/models/rolemodel");
const aclModel = require("../models/aclModel");
const {
  updateACLResBody,
  addACLReqBody,
  appendACL,
} = require("../Utils/requestBodyHelper");

const getAcl = async (req, res, _next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    // console.log(result);
    return res.render("middlewares/acl/views/view", {
      title: "ACL Rule",
      module_title: "ACL Mangement",
      results: result,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getAcls = async (_req, res, _next) => {
  try {
    let result = await aclModel.find();
    return res.render("middlewares/ACL/views/list", {
      title: "ACL Rules",
      module_title: "ACL Mangement",
      results: result,
    });
    // res.send(result);
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const addACl = async (_req, res, _next) => {
  try {
    let dbRoles = await rolemodel.find();
    // console.log(dbRoles)
    return res.render("middlewares/ACL/views/add", {
      title: "Add ACL rule",
      module_title: "ACL Mangement",
      results: dbRoles,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postAddACl = async (req, res, next) => {
  try {
    let dbData = await aclModel.findOne({ role: req.body.role });
    if (dbData) {
      let aclData = appendACL(dbData, req.body);
      await aclModel.findByIdAndUpdate(
        dbData._id,
        { $set: aclData },
        { upsert: true }
      );
    } else {
      let aclData = addACLReqBody(req.body);
      let acl = new aclModel(aclData);
      await acl.save();
    }
    req.flash("success", "ACL RULE added successfully");
    res.redirect("/acl/");
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const editACl = async (req, res, _next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    return res.render("middlewares/ACL/views/edit", {
      title: "Edit ACL Rule",
      module_title: "ACL Mangement",
      results: result,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postEditACl = async (req, res, _next) => {
  aclId = req.params.id;
  try {
    let aclDbData = await aclModel.findById(aclId);
    aclData = updateACLResBody(req.body, aclDbData.role);
    await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    req.flash("success", "ACL RULE updated successfully");
    res.redirect("/acl/");
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postDeletACl = async (req, res, _next) => {
  aclId = req.params.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    req.flash("success", "ACL RULE deleted successfully");
    res.redirect("/acl/");
  } catch (error) {
    next(error);
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
