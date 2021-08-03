const { resourceModel } = require("../models/resourceModel");

// Resource Controllers
const addResource = async (req, res, next) => {
  try {
    let resourceData = Array.isArray(req.body) ? req.body : [req.body];
    let result = await resourceModel.insertMany(resourceData);
    if (!result) {
      res.status(400);
      res.json({
        success: false,
        message: "Failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(201);
    res.json({
      success: true,
      message: "Resourece  added successfully",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getResources = async (req, res, next) => {
  let filter = {};
  if (Object.keys(req.query).length) {
    let module = req.query.module ? (filter.module = req.query.module) : null;
    let resource_status = req.query.resource_status
      ? (filter.resource_status = req.query.resource_status)
      : null;
    let resource_name = req.query.resource_name
      ? (filter.resource_name = {
          $regex: new RegExp(req.query.resource_name, "i"),
        })
      : null;
    let resource_path = req.query.resource_path
      ? (filter.resource_path = req.query.resource_path)
      : null;
  }

  try {
    let result = await resourceModel
      .find(filter)
      .populate("module", "_id module_name module_status");
    // console.log(!JSON.parse(result));
    if (!result || result.length <= 0) {
      res.status(404);
      res.json({
        success: false,
        message: "No data found",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: "All resources data",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getResource = async (req, res, next) => {
  try {
    let result = await resourceModel.findById(req.params.id);
    if (!result) {
      res.status(404);
      res.json({
        success: false,
        message: "No data found",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: "Resource data",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    let { id, ...updateData } = req.body;
    let result = await resourceModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!result) {
      res.status(400);
      res.json({
        success: false,
        message: "Resource update failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: "Resource updated",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = await resourceModel.findByIdAndRemove(id);
    if (!result) {
      res.status(400);
      res.json({
        success: false,
        message: "Resource deletion failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: "Resource deleted",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const mapModuleToResource = async (req, res, next) => {
  try {
    let result = await resourceModel.findOneAndUpdate(
      { _id: req.body.resourceId },
      {
        $set: { module: req.body.moduleId },
      },
      { new: true }
    );
    if (!result) {
      res.status(400);
      res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    res.json({
      success: true,
      message: "Mapped successfully",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// const removemethodFromResource = async (req, res, next) => {
//   try {
//     let resourceID = req.body.id;
//     let methodIDs = [];

//     if (Array.isArray(req.body.methodID)) {
//       methodIDs = req.body.methodID;
//     } else {
//       methodIDs.push(req.body.methodID);
//     }

//     let result = await resourceModel.findOneAndUpdate(
//       { _id: resourceID },
//       {
//         $pull: { methods: { $in: methodIDs } },
//       },
//       { multi: true, new: true }
//     );
//     if (!result) {
//       res.status(400);
//       res.json({
//         success: false,
//         message: "Failed",
//         data: result,
//         accesstoken: req.accesstoken,
//       });
//     }
//     res.status(200);
//     res.json({
//       success: true,
//       message: "Method(s) removed from Resource",
//       data: result,
//       accesstoken: req.accesstoken,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  addResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  mapModuleToResource,
  // removemethodFromResource,
};
