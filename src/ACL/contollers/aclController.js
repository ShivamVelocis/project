const CONFIG = require("../configs/config");
const aclModel = require("../models/aclModel");
const aclHelper = require("../Utils/aclHelper");

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
      return res.json({
        success: false,
        message: "ACL Rule not available",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "ACL Rule",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// const getAcls = async (req, res, next) => {
//   let filter = {};
//   if (Object.keys(req.query).length) {
//     let role = req.query.role ? (filter.role = req.query.role) : null;
//     let module_name = req.query.module_name
//       ? (filter.module_name = {
//           $regex: new RegExp(req.query.module_name, "i"),
//         })
//       : null;
//   }
//   try {
//     let result = await aclModel
//       .find(filter)
//       .populate({
//         path: "allowedResources",
//         select: { module: 0, __v: 0 },
//       })
//       .populate({
//         path: "denyResources",
//         select: { module: 0, __v: 0 },
//       });

//     res.status(200);
//     return res.json({
//       success: true,
//       message: "All ACL Rules",
//       data: result,
//       accesstoken: req.accesstoken,
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

const getAcls = async (req, res, next) => {
  try {
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
            role_title: "$roledata",
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
          role_name: "$_id.role_title.role_name",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    let result = await aclModel.aggregate(pipeline);
    if (!result && !result.length) {
      return res.json({
        success: false,
        message: "No record(s) found",
        data: null,
        accesstoken: req.accesstoken,
      });
    } else {
      return res.json({
        success: true,
        message: "ACL rule",
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
    let dbData = await aclModel.findOne({ role: req.body.role });
    if (dbData) {
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
  // console.log(aclId)
  try {
    let result = await aclModel.findByIdAndRemove(aclId);
    if (!result) {
      res.status(200);
      return res.json({
        success: false,
        message: "Invalid Acl ID",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.ACL_DELETE_SUCCESS,
      data: null,
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
    let dbRoleData = await aclModel
      .findOne({ role: userRole })
      .populate({
        path: "allowedResources",
        select: { module: 0, __v: 0 },
      })
      .populate({
        path: "denyResources",
        select: { module: 0, __v: 0 },
      });

    if (userRole && dbRoleData) {
      allowedResources = dbRoleData.allowedResources.map((resource) => {
        return { path: resource.resource_path, methods: resource.methods };
      });
      denyResources = dbRoleData.denyResources.map((resource) => {
        return { path: resource.resource_path, methods: resource.methods };
      });

      // ACL check
      isAllowed =
        aclHelper.allowedResource(
          allowedResources,
          resourceToBeAccess,
          resourceMethod
        ) &&
        aclHelper.denyResource(
          denyResources,
          resourceToBeAccess,
          resourceMethod
        );

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
};
