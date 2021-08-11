const WorkflowModel = require("../Models/workflow.model");
const ContentModel = require("../../ContentManagement/models/contentModels");
const lodash = require("lodash");

//Approve/Reject content
approvalContent = async (req, res, next) => {
  try {
    let module = req.body.module;
    let contentId = req.body.id;
    let userAction = req.body.action;

    //content data
    let contentData = await ContentModel.findOne({ _id: contentId });
    // console.log(contentData.content_status);
    if (!contentData) {
      return res.json({
        success: false,
        message: "Invalid Content Id",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    // workflow data
    let worlflowData = await WorkflowModel.findOne({
      "States.state": contentData.content_State,
      Module: module,
    });

    // console.log(worlflowData);
    if (!worlflowData || !worlflowData.States) {
      return res.json({
        success: false,
        message: "Invalid module/flow",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    // return data workflow state
    let state = lodash.find(worlflowData.States, function (state) {
      return state.state == contentData.content_State;
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

    if (state.isTerminateState) {
      return res.json({
        success: false,
        message: "Workflow already completed",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    if (!state.isStateUpdatable) {
      return res.json({
        success: false,
        message: "State is not updatable",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    // check user action(approved or any) and return action and role
    let action = lodash.find(state.actions, function (action) {
      return action.action == userAction;
    });
    // console.log("action", action);
    if (!action) {
      return res.json({
        success: false,
        message: "Invalid action",
        data: null,
        accesstoken: req.accesstoken,
      });
    }

    let nextState = lodash.find(worlflowData.States, function (state) {
      return state.state == action.action;
    });

    // check is user allowed to perform action or not
    if (action.role && action.role.includes(req.userRole)) {
      let updatedata = await ContentModel.findByIdAndUpdate(
        contentId,
        {
          $set: {
            content_State: action.action,
            content_status: nextState.status,
          },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Step completed",
        data: updatedata,
        accesstoken: req.accesstoken,
      });
    } else {
      res.json({
        success: false,
        message: "Not Authorized",
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get options for next step of content flow
getContentFlow = async (req, res, next) => {
  let module = req.body.module;
  let contentId = req.params.id;

  try {
    let contentData = await ContentModel.findOne({ _id: contentId });
    // console.log(contentData.content_status);
    if (!contentData) {
      throw new Error("Invalid Content Id");
    }

    // workflow data
    let worlflowData = await WorkflowModel.findOne({
      "States.state": contentData.content_State,
      Module: module,
    });

    // console.log(worlflowData);
    if (!worlflowData || !worlflowData.States) {
      throw new Error("Invalid module/flow");
    }

    // return content workflow state
    let state = lodash.find(worlflowData.States, function (state) {
      return state.state == contentData.content_State;
    });

    // console.log("State", state);
    if (!state) {
      throw new Error("Invalid flow");
    }

    if (state.isTerminateState) {
      throw new Error("Workflow already completed");
    }

    if (!state.isStateUpdatable) {
      throw new Error("State is not updatable");
    }

    let actionAllowed = [];
    state.actions.map((action) => {
      actionAllowed.push({ action: action.action });
    });
    return res.json({
      success: true,
      message: "Action allowed",
      data: actionAllowed,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { approvalContent, getContentFlow };
