const CONFIG = require("../configs/config");
const aclModel = require("../models/aclModel");
const aclHelper = require("../Utils/aclHelper");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    // db call
    let result = await aclModel
      .findById(aclId)
      .populate({
        path: "allowedResources",
        match: { resource_status: 1 },
        select: {
          methods: 1,
          resource_name: 1,
          resource_path: 1,
          resource_status: 1,
        },
      })
      .populate({
        path: "denyResources",
        match: { resource_status: 1 },
        select: {
          methods: 1,
          resource_name: 1,
          resource_path: 1,
          resource_status: 1,
        },
      });
    // check if db call return data
    if (!result) {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_RULE_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    // response
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.ADD_ACL,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    // pipeline for aggregate query
    let pipeline = [
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "role_name",
          as: "roledata",
        },
      },
      {
        $unwind: {
          path: "$allowedResources",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$denyResources",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$roledata",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "resources",
          localField: "allowedResources",
          foreignField: "_id",
          as: "allowedResources",
        },
      },
      {
        $lookup: {
          from: "resources",
          localField: "denyResources",
          foreignField: "_id",
          as: "denyResources",
        },
      },
      {
        $unwind: {
          path: "$allowedResources",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$denyResources",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            role: "$role",
            roleData: "$roledata",
            _id: "$_id",
          },
          allowedResources: {
            $push: "$allowedResources",
          },
          denyResources: {
            $push: "$denyResources",
          },
        },
      },
      {
        $addFields: {
          role: "$_id.role",
          role_title: "$_id.roleData.role_title",
          _id: "$_id._id",
        },
      },
      {
        $project: {
          "allowedResources.__v": 0,
          "allowedResources.createdAt": 0,
          "allowedResources.updatedAt": 0,
          "allowedResources.module": 0,
          "denyResources.__v": 0,
          "denyResources.createdAt": 0,
          "denyResources.updatedAt": 0,
          "denyResources.module": 0,
        },
      },
    ];
    // db call
    let result = await aclModel.aggregate(pipeline);
    // if condition if db call return empty array
    if (!result || !result.length) {
      return res.json({
        success: false,
        message: CONFIG.NO_RULE_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    } else {
      // if db call return array of records
      return res.json({
        success: true,
        message: CONFIG.ADD_ACL,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

const addAcl = async (req, res, next) => {
  try {
    let responseData;
    let allowedResources = req.body.allowedResources || [];
    let denyResources = req.body.denyResources || [];
    let children = req.body.children || [];
    let childOf = req.body.childOf || [];
    // checks if acl rule already avaliable for given role
    let dbData = await aclModel.findOne({ role: req.body.role });
    // if acl rule already saved in db
    // $addToSet added element(s) to array without duplicating
    if (dbData) {
      responseData = await aclModel.findOneAndUpdate(
        { role: req.body.role },
        {
          $addToSet: {
            allowedResources: { $each: allowedResources },
            denyResources: { $each: denyResources },
            children: { $each: children },
            childOf: { $each: childOf },
          },
        },
        { new: true }
      );
    } else {
      // if no acl rule avaliable with given role
      let newAcl = {
        role: req.body.role,
        allowedResources,
        denyResources,
        childOf: childOf,
        children: children,
      };
      let acl = new aclModel(newAcl);
      responseData = await acl.save();
    }

    res.status(201);
    return res.json({
      success: true,
      message: CONFIG.ACL_ADD_SUCCESS,
      data: responseData,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// delete the resource,children and childOf from db
const editAcl = async (req, res, next) => {
  aclId = req.body.id;
  let allowedResources = req.body.allowedResources || [];
  let denyResources = req.body.denyResources || [];
  let children = req.body.children || [];
  let childOf = req.body.childOf || [];
  let updateAcl = {};

  if (req.body.aclStatus == 0 || req.body.aclStatus)
    updateAcl.aclStatus = req.body.aclStatus;
  try {
    // $pull pull element from array in mongodb
    // $set set new value for specified keys
    let updateACLRule = await aclModel.findByIdAndUpdate(
      aclId,
      {
        $pull: {
          allowedResources: { $in: allowedResources },
          denyResources: { $in: denyResources },
          children: { $in: children },
          childOf: { $in: childOf },
        },
        $set: updateAcl,
      },
      { new: true }
    );
    res.status(200);
    return res.json({
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
    let result = await aclModel.findByIdAndRemove(aclId);

    if (!result) {
      res.status(200);
      return res.json({
        success: false,
        message: CONFIG.NO_RULE_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.ACL_DELETE_SUCCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const aclCheck = async (req, res) => {
  try {
    let resourceToBeAccess = req.body.resourceToBeAccess;
    let resourceMethod = req.body.resourceMethod;
    let userRole = req.body.userRole;
    let allowedResources;
    let denyResources;
    let isAllowed = false;

    // acldata from db
    let aclData = await aclModel
      .find({ aclStatus: 1 })
      .populate({
        path: "allowedResources",
        match: { resource_status: 1 },
        select: { module: 0, __v: 0 },
      })
      .populate({
        path: "denyResources",
        match: { resource_status: 1 },
        select: { module: 0, __v: 0 },
      });
    // console.log('aclData: ', aclData);

    if (aclData && aclData.length && lodash.find(aclData, ["role", userRole])) {
      dbRoleData = aclHelper.extractAclSubRulesData(req.userRole, aclData);
    }

    if (userRole && dbRoleData) {
      allowedResources = dbRoleData.allowedResources.map((resource) => {
        return { path: resource.resource_path, methods: resource.methods };
      });
      denyResources = dbRoleData.denyResources.map((resource) => {
        return { path: resource.resource_path, methods: resource.methods };
      });
      console.log(
        aclHelper.allowedResource(allowedResources, req.originalUrl, req.method)
      );
    }
    // ACL check
    isAllowed =
      aclHelper.allowedResource(
        allowedResources,
        resourceToBeAccess,
        resourceMethod
      ) &&
      aclHelper.denyResource(denyResources, resourceToBeAccess, resourceMethod);

    if (isAllowed) {
      res.send(200);
      return res.json({
        status: true,
        message: "Access allowed",
      });
    } else {
      res.send(401);
      return res.json({
        status: false,
        message: "Access denied",
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllChildrenData = async (req, res, next) => {
  let dbRoleData;
  try {
    let aclData = await aclModel
      .find({ aclStatus: 1 })
      .populate({
        path: "allowedResources",
        match: { resource_status: 1 },
        select: { module: 0, __v: 0 },
      })
      .populate({
        path: "denyResources",
        match: { resource_status: 1 },
        select: { module: 0, __v: 0 },
      });
    // console.log(aclData);
    if (!aclData.length) {
      res.status(404);
      return res.json({
        success: false,
        message: `No reocrd(s) found`,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    dbRoleData = aclHelper.extractAclSubRulesData(req.params.userRole, aclData);
    // console.log("dbRoleData: ", dbRoleData);

    // console.log(tester.extractResourcesFromAcls(dbRoleData.acls));
    if (dbRoleData) {
      res.status(200);
      return res.json({
        success: true,
        message: `Children of ${req.params.userRole}`,
        data: dbRoleData,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: `No reocrd(s) found`,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
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
  aclCheck,
  getAllChildrenData,
};
