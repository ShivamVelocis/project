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
    if (!result) {
      return res.json({
        success: false,
        message: "No Record found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: "Workflow Data",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

addWorkflow = async (req, res, next) => {
  try {
    let newWorkflow = new WorkflowModel(req.body);
    let result = await newWorkflow.save();
    if (!result) {
      return res.json({
        success: false,
        message: "Workflow not saved",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: "Workflow added successfully",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

deleteWorkflow = async (req, res, next) => {
  try {
    let result = await WorkflowModel.findByIdAndDelete(req.body.id);
    if (!result) {
      return res.json({
        success: false,
        message: "Workflow deletion failed",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: "Workflow deleted successfully",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// editWorkflow = async (req, res, next) => {
//   try {
//     let filter = {};
//     let result = await WorkflowModel.findByIdAndDelete(req.body.id);
//     if (!result) {
//       return res.json({
//         success: false,
//         message: "Workflow Updation failed",
//         data: null,
//         accesstoken: req.accesstoken,
//       });
//     }
//     return res.json({
//       success: true,
//       message: "Workflow Updated successfully",
//       data: result,
//       accesstoken: req.accesstoken,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { getWorkflows, addWorkflow, deleteWorkflow };
