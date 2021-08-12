const WorkflowModel = require("../Models/workflow.model");
const ApprovalModel = require("../Models/approval.model");
const lodash = require("lodash");

let getApprovalData = async (req, res, next) => {
  try {
    console.log(req.params.id);
    let approvalData = await ApprovalModel.findById(req.params.id);
    // console.log(contentData.content_status);
    if (!approvalData) {
      return res.json({
        success: false,
        message: "No Record(s) Found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    console.log(approvalData);

    let workFlowData = await WorkflowModel.findOne({
      module: approvalData.module,
    });

    if (!workFlowData) {
      return res.json({
        success: false,
        message: "No Workflow Found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    // return data workflow state
    let state = lodash.find(workFlowData.states, function (state) {
      return state.wfLevel == approvalData.level;
    });

    // console.log("State", state);
    if (!state) {
      return res.json({
        success: false,
        message: "Invalid flow",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    return res.json({
      success: true,
      message: "Allowed Action",
      data: state.wfNextActions,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

let approval = async (req, res, next) => {
  try {
    // console.log(req.body);
    let approvalData = await ApprovalModel.findOne({ id: req.body.id });
    // console.log(approvalData);
    if (!approvalData) {
      return res.json({
        success: false,
        message: "No Record(s) Found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    let workFlowData = await WorkflowModel.findOne({
      module: approvalData.module,
    });

    if (!workFlowData) {
      return res.json({
        success: false,
        message: "No Workflow Found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    // console.log(workFlowData);
    // return data workflow state
    let state = lodash.find(workFlowData.states, function (state) {
      // console.log(state);
      return state.wfLevel == approvalData.level;
    });

    if (!state) {
      return res.json({
        success: false,
        message: "Invalid flow",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (state.wfLevelName == "REJECTED" || state.wfLevelName == "APPROVED") {
      return res.json({
        success: false,
        message: "Workflow already completed",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (state.wfRole != req.userRole) {
      return res.json({
        success: false,
        message: "Your are not allowed to perform this action",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    // lodash.find(state.wfNextActions, [nextAction, req.body.action])
    // console.log("State",  lodash.find(state.wfNextActions, ["nextAction", req.body.action]));
    if (!lodash.find(state.wfNextActions, ["nextAction", req.body.action])) {
      return res.json({
        success: false,
        message: "Invalid action",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (req.body.action == "REJECTED" && !req.body.comment) {
      return res.json({
        success: false,
        message: "In case of Rejected please provide comment also",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    let updatedData = await ApprovalModel.findOneAndUpdate(
      { id: req.body.id },
      {
        $set: {
          level: req.body.action,
          comment: req.body.comment || null,
          updatedBy: req.user,
        },
      },
      { new: true }
    );

    if (!updatedData) {
      return res.json({
        success: false,
        message: "Approval Failed",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    return res.json({
      success: true,
      message: "Successfully Completed",
      data: updatedData,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

let getWfStatu = async (req, res, next) => {
  try {
    let approvalData = await ApprovalModel.findById(req.params.id);

    if (!approvalData) {
      return res.json({
        success: false,
        message: "No Record(s) Found",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    return res.json({
      success: true,
      message: "Status",
      data: { status: approvalData.level, comment: approvalData.comment },
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

let addToapproval = async (req, res, next) => {
  try {
    let isDuplicate = await ApprovalModel.findOne({ id: req.body.id });
    if (isDuplicate) {
      return res.json({
        status: false,
        message: "Request already added to workflow",
        data: newRequest,
        accesstoken: req.accesstoken,
      });
    }
    let newRequest = new ApprovalModel({
      level: req.body.level,
      updatedBy: req.user,
      id: req.body.id,
      module: req.body.module,
    });
    let savedRequest = newRequest.save();
    return res.json({
      status: true,
      message: "Requested added to workflow",
      data: newRequest,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getApprovalData, approval, getWfStatu, addToapproval };
