const CONFIG = require("../configs/config");
const aclModel = require("../models/aclModel");
const { appendACL } = require("../Utils/helper");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    if (!result) {
      return res.json({
        status: false,
        message: "ACL Rule not available",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      status: true,
      message: "ACL Rule",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    let result = await aclModel.find();
    return res.json({
      status: true,
      message: "All ACL Rules",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addACl = async (req, res, next) => {
  try {
    let responseData;
    let dbData = await aclModel.findOne({ role: req.body.role });
    if (dbData) {
      let result = appendACL(dbData, req.body);
      responseData = await aclModel.findOneAndUpdate(
        { role: req.body.role },
        { $set: result }
      );
    } else {
      let acl = new aclModel(req.body);
      responseData = await acl.save();
    }
    return res.json({
      status: true,
      message: CONFIG.ACL_ADD_SUCCESS,
      data: responseData,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const editACl = async (req, res, next) => {
  aclId = req.body.id;

  try {
    let dbACLData = await aclModel.findById(aclId);
    let updatedData = appendACL(dbACLData, req.body);
    let updateACLRule = await aclModel.findByIdAndUpdate(
      aclId,
      {
        $set: updatedData,
      },
      { upsert: true }
    );
    return res.json({
      status: true,
      message: CONFIG.ACL_UPDATE_SUCESS,
      data: updateACLRule,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const deletACl = async (req, res, next) => {
  aclId = req.body.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    return res.json({
      status: true,
      message: CONFIG.ACL_DELETE_SUCCESS,
      data: null,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addACl,
  editACl,
  deletACl,
  getAcls,
  getAcl,
};
