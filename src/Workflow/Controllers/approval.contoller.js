const WorkflowModel = require("../Models/workflow.model");
const ContentModel = require("../../ContentManagement/models/contentModels");
const lodash = require("lodash");

approvalContent = async (req, res, next) => {
  try {
    let module = req.body.module;
    let contentId = req.body.id;
    let userAction = req.body.action;

    //content data
    let contentData = await ContentModel.findOne({ _id: contentId });
    // console.log(contentData.content_status);
    if (!contentData) return res.send("Invalid Content Id");

    // workflow data
    let worlflowData = await WorkflowModel.findOne({
      "States.state": contentData.content_status,
      Module: module,
    });

    // console.log(worlflowData);
    if (!worlflowData || !worlflowData.States)
      return res.send("Invalid module/flow");

    // return data workflow state
    let state = lodash.find(worlflowData.States, function (state) {
      return state.state == contentData.content_status;
    });

    // console.log("State", state);
    if (!state) return res.send("Invalid flow");

    if (state.isTerminateState) {
      return res.send("Workflow is in terminate state");
    }

    if (!state.isStateUpdatable) {
      return res.send("State is not updatable");
    }

    // check user action(approved or any) and return action and role
    let action = lodash.find(state.actions, function (action) {
      return action.action == userAction;
    });
    // console.log("action", action);
    if (!action) return res.send("Invalid action");

    // console.log(req.userRole);
    // check is user allowed to perform action or not
    if (action.role && action.role.includes(req.userRole)) {
      let updatedata = await ContentModel.findByIdAndUpdate(contentId, {
        $set: { content_status: action.action },
      });
      return res.send(updatedata);
    } else {
      res.send("Not Authorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { approvalContent };
