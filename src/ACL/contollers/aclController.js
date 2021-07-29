const CONFIG = require("../configs/config");
const aclModel = require("../models/aclModel");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    if (!result) {
      return res.json({
        status: false,
        message: "ACL Rule not available",
        data: null,
      });
    }
    return res.json({ status: true, message: "ACL Rule", data: result });
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

const addACl = async (req, res, next) => {
  try {
    let acl = new aclModel(req.body);
    let result = await acl.save();
    return res.json({
      status: true,
      message: CONFIG.ACL_ADD_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const editACl = async (req, res, next) => {
  aclId = req.body.id;
  try {
    let updateACLRule = await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    return res.json({
      status: true,
      message: CONFIG.ACL_UPDATE_SUCESS,
      data: updateACLRule,
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
