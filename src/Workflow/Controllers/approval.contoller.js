const WorkflowModel = require("../Models/workflow.model");
const ApprovalModel = require("../Models/approval.model");
const lodash = require("lodash");
const { CONFIG } = require("../Configs/config");
// 0->Draft
// 1->Published/inititiated
// 2->Unpublished
// 3->Approved
// 4->Recjected
// 5-> level 1
// 6-> level 2
// 7-> level 3
// 8-> level 4
// return action available for approver
const getApprovalData = async (req, res, next) => {
  try {
    let approvalData = await ApprovalModel.findById(req.params.id);
    //
    if (!approvalData) {
      return res.json({
        success: false,
        message: CONFIG.NO_RECORD_FOUND,
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
        message: CONFIG.NO_WORKFLOW_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    // return data workflow state
    let state = lodash.find(workFlowData.states, function (state) {
      return state.wfLevel == approvalData.level;
    });

    //
    if (!state) {
      return res.json({
        success: false,
        message: CONFIG.INVALID_FLOW,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    return res.json({
      success: true,
      message: CONFIG.ACTIONS_ALLOWED,
      data: state.wfNextActions,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// approver action
const approval = async (req, res, next) => {
  try {
    //
    let approvalData = await ApprovalModel.findOne({ id: req.body.id });
    //
    if (!approvalData) {
      return res.json({
        success: false,
        message: CONFIG.NO_RECORD_FOUND,
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
        message: CONFIG.NO_WORKFLOW_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    //
    // return data workflow state
    let state = lodash.find(
      workFlowData.states,
      (state) => state.wfLevel == approvalData.level
    );

    if (!state) {
      return res.json({
        success: false,
        message: CONFIG.INVALID_FLOW,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (state.wfLevel == 3 || state.wfLevel == 4) {
      return res.json({
        success: false,
        message: CONFIG.WORKFLOW_COMPLETED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (state.wfRole != req.userRole) {
      return res.json({
        success: false,
        message: CONFIG.NOT_AUTHORIZED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
    // lodash.find(state.wfNextActions, [nextAction, req.body.action])
    //
    if (!lodash.find(state.wfNextActions, ["nextAction", req.body.action])) {
      return res.json({
        success: false,
        message: CONFIG.INVALID_ACTION,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (req.body.action == 4 && !req.body.comment) {
      return res.json({
        success: false,
        message: CONFIG.NO_COMMENT,
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
        message: CONFIG.APPROVAL_FAILED,
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    return res.json({
      success: true,
      message: CONFIG.APPROVAL_SUCCESS,
      data: updatedData,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// get status
const getWfStatu = async (req, res, next) => {
  try {
    let approvalData = await ApprovalModel.findById(req.params.id);

    if (!approvalData) {
      return res.json({
        success: false,
        message: CONFIG.NO_RECORD_FOUND,
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

// to item to aprroval table/collection for wrokflow
const addToapproval = async (req, res, next) => {
  try {
    let isDuplicate = await ApprovalModel.findOne({ id: req.body.id });
    if (isDuplicate) {
      return res.json({
        status: false,
        message: CONFIG.ALREADY_ADDED_TO_APPROVAL,
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
      message: CONFIG.ADDED_FOR_APPROVAL_SUCCESS,
      data: savedRequest,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

// get all approvals data or query by module/level
const getApprovalsData = async (req, res, next) => {
  try {
    let filter = {};
    if (Object.keys(req.query).length) {
      let module = req.query.module
        ? (filter.module = {
            $regex: new RegExp(req.query.module, "i"),
          })
        : null;
      let level = req.query.level ? (filter.level = req.query.level) : null;
    }
    let result = await ApprovalModel.find(filter);

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
      message: "Apprvoals data",
      data: result,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovalData,
  approval,
  getWfStatu,
  addToapproval,
  getApprovalsData,
};
