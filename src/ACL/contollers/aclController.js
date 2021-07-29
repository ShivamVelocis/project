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
    if (!result) {
      return res.json({ status: true, message: "ACL Rule", data: result });
    }
  } catch (error) {
    next(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    let result = await aclModel.find();
    return res.json({ status: true, message: "All ACL Rules", data: result });
  } catch (error) {
    console.log(error);
    next(error);
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
    return res.json({
      status: true,
      message: CONFIG.ACL_ADD_SUCCESS,
      data: null,
    });
  } catch (error) {
    next(error);
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
    return res.json({
      status: true,
      message: CONFIG.ACL_UPDATE_SUCESS,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const postDeletACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    return res.json({
      status: true,
      message: CONFIG.ACL_DELETE_SUCCESS,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postAddACl,
  postEditACl,
  postDeletACl,
  getAcls,
  getAcl,
};
