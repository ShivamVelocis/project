const CONFIG = require("../configs/config");
const rolemodel = require("../../roleManagement/models/rolemodel");
const aclModel = require("../models/aclModel");
const resourceModel = require("../models/resourcesModel");
const {
  updateACLResBody,
  addACLReqBody,
  appendACL,
} = require("../Utils/requestBodyHelper");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    return res.render("ACL/views/view", {
      title: CONFIG.ADD_TITLE,
      module_title: CONFIG.MODULE_TITLE,
      results: result,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    let result = await aclModel.find();
    return res.render("ACL/views/list", {
      title: "ACL Rules",
      module_title: CONFIG.MODULE_TITLE,
      results: result,
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const addACl = async (req, res, next) => {
  try {
    let dbResourcesData = await resourceModel.find();
    let dbRolesData = await rolemodel.find();
    if (dbResourcesData && dbRolesData) {
      return res.render("ACL/views/add", {
        title: CONFIG.ADD_ACL,
        module_title: CONFIG.MODULE_TITLE,
        results: dbRolesData,
        resources: dbResourcesData,
      });
    } else {
      req.flash("error", CONFIG.NO_RULE_FOUND);
      return res.render("ACL/views/add", {
        title: CONFIG.ADD_ACL,
        module_title: CONFIG.MODULE_TITLE,
        results: null,
        resources: null,
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postAddACl = async (req, res, next) => {
  try {
    console.log(req.body);
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
    req.flash("success", CONFIG.ACL_ADD_SUCCESS);
    res.redirect("/acl/");
  } catch (error) {
    // next(error);
    req.flash("error", error.message);
    res.redirect("/acl/add");
    // console.log(error.message);
  }
};

const editACl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    if (result) {
      return res.render("ACL/views/edit", {
        title: CONFIG.UPDATE_ACL,
        module_title: CONFIG.MODULE_TITLE,
        results: result,
      });
    }else{
      req.flash("error",CONFIG.NO_RULE_FOUND)
      return res.render("ACL/views/edit", {
        title: CONFIG.UPDATE_ACL,
        module_title: CONFIG.MODULE_TITLE,
        results: null,
      });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

const postEditACl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let aclDbData = await aclModel.findById(aclId);
    aclData = updateACLResBody(req.body, aclDbData.role);
    await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    req.flash("success", CONFIG.ACL_UPDATE_SUCESS);
    res.redirect("/acl/");
  } catch (error) {
    // next(error);
    req.flash("error", error.message);
    res.redirect(`/acl/edit/${aclId}`);
    // console.log(error);
  }
};

const postDeletACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    req.flash("success", CONFIG.ACL_DELETE_SUCCESS);
    res.redirect("/acl/");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect(`/acl/delete/${aclId}`);
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
