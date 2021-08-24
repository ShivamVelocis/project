const { statusModel } = require("../models/statusModel");

const addStatus = (req, res, next) => {
  try {
    let statusData = Array.isArray(req.body) ? req.body : [req.body];
    let result = statusModel.insertMany(statusData);
    if (!result) {
      res.status(400);
      return res.json({
        success: false,
        message: "Status_ADD_FAILED",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    res.status(201);
    return res.json({
      success: true,
      message: "Status_ADD_SUCCESS",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStatus = async (req, res, next) => {
  let filter = {};
  if (Object.keys(req.query).length) {
    let status_title = req.query.status_title
      ? (filter.status_title = req.query.status_title)
      : null;
    let status = req.query.status ? (filter.status = req.query.status) : null;
  }

  try {
    let result = await statusModel.find(filter);
    // console.log(!JSON.parse(result));
    if (!result || result.length <= 0) {
      res.status(404);
      return res.json({
        success: false,
        message: "no record found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "all status",
      data: result,
      accesstokon: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    let result = await statusModel.findById(req.params.id);
    if (!result) {
      res.status(404);
      return res.json({
        success: false,
        message: "CONFIG.NO_RESOURCE_FOUND",
        data: result,
        accesstoken: req.accesstoken,
      });
    }
    res.status(200);
    return res.json({
      success: true,
      message: "RESOURCE_FETCH_SUCCESS",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// Update status data
const updateStatus = async (req, res, next) => {
  try {
    let { id, ...updateData } = req.body;
    let result = await statusModel.findByIdAndUpdate(
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

const deleteStatus = async (req, res, next) => {
  try {
    let { id } = req.body;
    let result = await statusModel.findByIdAndRemove(id);
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

module.exports = {
  addStatus,
  getStatus,
  updateStatus,
  deleteStatus,
  getAllStatus,
};
