const CONFIG = require("../configs/config");
const { resourceModel } = require("../models/resourceModel");

// Resource Controllers
const addResource = async (req, res, next) => {
  try {
    let resourceData = Array.isArray(req.body) ? req.body : [req.body];
    let result = await resourceModel.insertMany(resourceData);
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: CONFIGG.RESOURCE_ADD_FAILED,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(201);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_ADD_SUCCESS,
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all resiurce data
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
      return res.json({
        success: false,
        message: CONFIG.NO_RESOURCE_FOUND,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_FETCH_SUCCESS,
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch specific resource data
const getResource = async (req, res, next) => {
  try {
    let result = await resourceModel.findById(req.params.id);
    if (!result) {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_RESOURCE_FOUND,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_FETCH_SUCCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Update resource data
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
      return res.json({
        success: false,
        message: CONFIG.RESOURCE_UPDATE_FAILED,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_UPDATE_SUCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Delete resource
const deleteResource = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = await resourceModel.findByIdAndRemove(id);
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: CONFIG.RESOURCE_DELETE_FAILED,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_DELETE_SUCCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Add module id to resource
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
      return res.json({
        success: false,
        message: CONFIG.MODULE_MAPPING_FAILED,
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: CONFIG.RESOURCE_FETCH_SUCCESS,
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  mapModuleToResource,
};
