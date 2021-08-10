const WorkflowModel = require("../Models/workflow.model");

getWorkflows = async (req, res, next) => {
  try {
    let filter = {};
    if (Object.keys(req.query).length) {
      let Module = req.query.Module
        ? (filter.Module = {
            $regex: new RegExp(req.query.Module, "i"),
          })
        : null;
    }
    let result = await WorkflowModel.find(filter);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

addWorkflow = async (req, res, next) => {
  try {
    let newWorkflow = new WorkflowModel(req.body);
    let result = await newWorkflow.save();
    res.send(result);
  } catch (error) {
    next(error);
  }
};

deleteWorkflow = async (req, res, next) => {
  try {
    let result = await WorkflowModel.findByIdAndDelete(req.body.id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

editWorkflow = async (req, res, next) => {
  try {
    let filter = {};
    let result = await WorkflowModel.findByIdAndDelete(req.body.id);
    res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { getWorkflows, addWorkflow, deleteWorkflow };
