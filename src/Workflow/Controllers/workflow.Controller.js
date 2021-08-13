const WorkflowModel = require("../Models/workflow.model");
const { CONFIG } = require("../Configs/config");

let getWorkflows = async (req, res, next) => {
  try {
    let filter = {};
    if (Object.keys(req.query).length) {
      let module = req.query.module
        ? (filter.module = {
            $regex: new RegExp(req.query.module, "i"),
          })
        : null;
    }
    let result = await WorkflowModel.find(filter);

    if (!result || !result.length) {
      return res.json({
        success: false,
        message: CONFIG.NO_RECORD_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: CONFIG.WORKFLOW_DATA,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

let addWorkflow = async (req, res, next) => {
  try {
    let newWorkflow = new WorkflowModel(req.body);
    let result = await newWorkflow.save();
    if (!result) {
      return res.json({
        success: false,
        message: CONFIG.WORKFLOW_SAVED_FAILED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: CONFIG.ADDED_SUCCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

let deleteWorkflow = async (req, res, next) => {
  try {
    let result = await WorkflowModel.findByIdAndDelete(req.body.id);
    if (!result) {
      return res.json({
        success: false,
        message: CONFIG.WORKFLOW_DELETION_FAILED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: CONFIG.DELETE_SUCCESS,
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkflows, addWorkflow, deleteWorkflow };
