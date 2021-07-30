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
    res.json({
      success: false,
      message: "",
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

    res.json({
      success: false,
      message: "",
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
    res.json({
      success: false,
      message: "",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// }const getModule = async (req,res,next)=>{

// }const getModule = async (req,res,next)=>{

// }const getModule = async (req,res,next)=>{

// }const getModule = async (req,res,next)=>{

// }const getModule = async (req,res,next)=>{

// }

// Resource Controllers
const addResource = async (req, res, next) => {
  try {
    let resourceData = req.body;
    let resource = new resourceModel(resourceData);
    let result = await resource.save();
    res.json({
      success: false,
      message: "",
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
    res.json({
      success: false,
      message: "",
      data: result,
      accesstokon: req.accesstoken,
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
    res.json({
      success: false,
      message: "",
      data: result,
      accesstokon: req.accesstoken,
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
    res.json({
      success: false,
      message: "",
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
    res.json({
      success: false,
      message: "",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMethod,
  addModule,
  addResource,
  getModules,
  getResources,
  getMethods,
  mapResourceInModule,
  mapModuleToResource,
};
