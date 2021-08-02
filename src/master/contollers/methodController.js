const { methodModel } = require("../models/methodModel");

// Methods Controller
const addMethod = async (req, res, next) => {
  try {
    let methodData = Array.isArray(req.body) ? req.body : [req.body];
    let result = await methodModel.insertMany(methodData);
    if (!result) {
      res.status(400);
      res.json({
        success: false,
        message: "Failed to add Method",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(201);
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
      res.status(400);
      res.json({
        success: false,
        message: "No data dound",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
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
    let result = await methodModel.findById(req.params.id);
    if (!result) {
      res.status(400);
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
      res.status(400);
      res.json({
        success: false,
        message: "Method updat failed",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(204);
    res.json({
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
    res.status(204);
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
  addMethod,
  getMethods,
  getMethod,
  updateMethod,
  deleteMethod,
};
