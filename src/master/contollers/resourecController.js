const { resourceModel } = require("../models/resourceModel");

// Resource Controllers
const addResource = async (req, res, next) => {
  try {
    let resourceData = req.body;
    let resource = new resourceModel(resourceData);
    let result = await resource.save();
    if (!result) {
      return res.json({
        success: false,
        message: "Failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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
  try {
    let result = await resourceModel
      .find()
      .populate("module", "_id module_name module_status")
      .populate("methods");
    if (!result) {
      return res.json({
        success: false,
        message: "No data found",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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
      return res.json({
        success: false,
        message: "No data found",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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
      return res.json({
        success: false,
        message: "Resource update failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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
      return res.json({
        success: false,
        message: "Resource deletion failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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
    let module = {};
    let methods = [];
    if (req.body.moduleId) {
      module.module = req.body.moduleId;
    }
    if (Array.isArray(req.body.methods)) {
      methods = req.body.methods;
    }
    let resourceId = req.body.resourceId;
    let result = await resourceModel.findOneAndUpdate(
      { _id: resourceId },
      {
        $addToSet: { methods: { $each: methods } },
        $set: module,
      },
      { new: true }
    );
    if (!result) {
      return res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
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

const removemethodFromResource = async (req, res, next) => {
  try {
    let resourceID = req.body.id;
    let methodIDs = [];

    if (Array.isArray(req.body.methodID)) {
      methodIDs = req.body.methodID;
    } else {
      methodIDs.push(req.body.methodID);
    }

    let result = await resourceModel.findOneAndUpdate(
      { _id: resourceID },
      {
        $pull: { methods: { $in: methodIDs } },
      },
      { multi: true, new: true }
    );
    if (!result) {
      return res.json({
        success: false,
        message: "Failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "Method(s) removed from Resource",
      data: result,
      accesstoken: req.accesstoken,
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
  removemethodFromResource,
};
