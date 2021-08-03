const { moduleModel } = require("../models/moduleModels");

// Module controllers
const addModule = async (req, res, next) => {
  try {
    let moduleData = Array.isArray(req.body) ? req.body : [req.body];
    let result = await moduleModel.insertMany(moduleData);
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "Adding Module failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(201);
    return res.json({
      success: true,
      message: "Module added successfully",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getModules = async (req, res, next) => {
  let filter = {};
  if (Object.keys(req.query).length) {
    let module_status = req.query.module_status
      ? (filter.module_status = req.query.module_status)
      : null;
    let module_name = req.query.module_name
      ? (filter.module_name = {
          $regex: new RegExp(req.query.module_name, "i"),
        })
      : null;
  }
  try {
    let result = await moduleModel.find(filter).populate({
      path: "module_resources",
      select: { module: 0, __v: 0 },
      populate: {
        path: "methods",
        select: { __v: 0 },
      },
    });
    if (!result || result.length <= 0) {
      res.status(404);
      return res.json({
        success: false,
        message: "No data failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "All Modules",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getModule = async (req, res, next) => {
  try {
    let result = await moduleModel.findById(req.params.id);
    if (!result) {
      res.status(404);
      return res.json({
        success: false,
        message: "No data dound",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "Module data",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const updateModule = async (req, res, next) => {
  try {
    let { id, ...updateData } = req.body;
    let result = await moduleModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "Module update failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "Module updated",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = await moduleModel.findByIdAndRemove(id);
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "Module deletion failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "Module deleted",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const mapResourceInModule = async (req, res, next) => {
  let resourceId = [];
  if (Array.isArray(req.body.resourcesId)) resourceId = req.body.resourcesId;
  try {
    let result = await moduleModel.findOneAndUpdate(
      {
        module_name: req.body.moduleName,
      },
      { $addToSet: { module_resources: { $each: resourceId } } },
      { new: true }
    );
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "Data mapped successfully",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const removeResouresFromModule = async (req, res, next) => {
  try {
    let moduleID = req.body.id;
    let resourceIDs = [];
    if (Array.isArray(req.body.resourceID)) {
      resourceIDs = req.body.resourceID;
    } else {
      resourceIDs.push(req.body.resourceID);
    }
    let result = await moduleModel.findOneAndUpdate(
      { _id: moduleID },
      { $pull: { module_resources: { $in: resourceIDs } } },
      { multi: true, new: true }
    );
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "Resource removed from module",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  mapResourceInModule,
  removeResouresFromModule,
};
