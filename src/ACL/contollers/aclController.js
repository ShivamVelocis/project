const CONFIG = require("../configs/config");
const aclModel = require("../models/aclModel");
// const { appendACL } = require("../Utils/helper");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel
      .findById(aclId)
      .populate({
        path: "allowedResources",
        select: { module: 0, __v: 0 },
      })
      .populate({
        path: "denyResources",
        select: { module: 0, __v: 0 },
      });
    if (!result) {
      res.status(404);
      res.json({
        success: false,
        message: "ACL Rule not available",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
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
    let result = await aclModel
      .find()
      .populate({
        path: "allowedResources",
        select: { module: 0, __v: 0 },
      })
      .populate({
        path: "denyResources",
        select: { module: 0, __v: 0 },
      });

    res.status(200);
    res.json({
      success: true,
      message: "All ACL Rules",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addAcl = async (req, res, next) => {
  try {
    let responseData;
    let allowedResources = req.body.allowedResources || [];
    let denyResources = req.body.denyResources || [];
    let dbData = await aclModel.findOne({ role: req.body.role });
    if (dbData) {
      // let result = appendACL(dbData, req.body);
      responseData = await aclModel.findOneAndUpdate(
        { role: req.body.role },
        {
          $addToSet: {
            allowedResources: { $each: allowedResources },
            denyResources: { $each: denyResources },
          },
        },
        { new: true }
      );
    } else {
      let newAcl = {
        role: req.body.role,
        allowedResources,
        denyResources,
      };
      let acl = new aclModel(newAcl);
      responseData = await acl.save();
    }
    res.status(201);
    res.json({
      success: true,
      message: CONFIG.ACL_ADD_SUCCESS,
      data: responseData,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const editAcl = async (req, res, next) => {
  aclId = req.body.id;
  let allowedResources = req.body.allowedResources || [];
  let denyResources = req.body.denyResources || [];
  try {
    let updateACLRule = await aclModel.findByIdAndUpdate(
      aclId,
      {
        $pull: {
          allowedResources: { $in: allowedResources },
          denyResources: { $in: denyResources },
        },
      },
      { new: true }
    );
    res.status(200);
    res.json({
      success: true,
      message: CONFIG.ACL_UPDATE_SUCESS,
      data: updateACLRule,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const deletAcl = async (req, res, next) => {
  aclId = req.body.id;
  try {
    await aclModel.findByIdAndRemove(aclId);
    res.status(200);
    res.json({
      success: true,
      message: CONFIG.ACL_DELETE_SUCCESS,
      data: null,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAcl,
  editAcl,
  deletAcl,
  getAcls,
  getAcl,
};
