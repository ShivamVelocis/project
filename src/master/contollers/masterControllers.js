const {
  moduleModel,
  resourceModel,
  methodModel,
} = require("../models/masterModels");

// Module controllers
const addModule = async (req, res, next) => {
  try {
    let moduleData = req.body;
    let module = new moduleModel(moduleData);
    let result = await module.save();
    if (!result) {
      return res.json({
        success: false,
        message: "Adding Module failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
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
  try {
    let result = await moduleModel.find().populate({
      path: "module_resources",
      select: { module: 0, __v: 0 },
      populate: {
        path: "methods",
        select: { __v: 0 },
      },
    });
    if (!result) {
      return res.json({
        success: false,
        message: "No data failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "All Modules",
      data: result,
      accesstokon: req.accesstoken,
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
      return res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
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
      return res.json({
        success: false,
        message: "failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "Resource removed from module",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getModule = async (req, res, next) => {
  try {
    let result = await moduleModel.findById(req.body.id);
    if (!result) {
      return res.json({
        success: false,
        message: "No data dound",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
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
      return res.json({
        success: false,
        message: "Module update failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
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
      return res.json({
        success: false,
        message: "Module deletion failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "Module deleted",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

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
    let result = await resourceModel.findById(req.body.id.toString());
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

// Methods Controller
const addMethod = async (req, res, next) => {
  try {
    let methodData = req.body;
    let method = new methodModel(methodData);
    let result = await method.save();
    if (!result) {
      return res.json({
        success: false,
        message: "Failed to add Method",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "Method added successfully",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getMethods = async (req, res, next) => {
  try {
    let result = await methodModel.find();
    if (!result) {
      return res.json({
        success: false,
        message: "No data dound",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.json({
      success: true,
      message: "All methods data",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getMethod = async (req, res, next) => {
  try {
    let result = await methodModel.findById(req.body.id);
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
      message: "Method data",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const updateMethod = async (req, res, next) => {
  try {
    let { id, ...updateData } = req.body;
    let result = await methodModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!result) {
      return res.json({
        success: false,
        message: "Method updat failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: "Method updated",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMethod = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = await methodModel.findByIdAndRemove(id);
    res.json({
      success: true,
      message: "Method deleted",
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

  addResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,

  addMethod,
  getMethods,
  getMethod,
  updateMethod,
  deleteMethod,

  mapResourceInModule,
  mapModuleToResource,
  removeResouresFromModule,
  removemethodFromResource,
};
