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

    if (!contentData) return res.send("Invalid Content Id");

    let worlflowData = await WorkflowModel.findOne({
      "States.state": contentData.content_status,
      Module: module,
    });

    if (!worlflowData || !worlflowData.States)
      return res.send("Invalid module/flow");

    let state = lodash.find(worlflowData.States, function (state) {
      return state.state == contentData.content_status;
    });

    // console.log("State", state);
    if (!state || !state.actions) return res.send("Invalid flow");

    let action = lodash.find(state.actions, function (action) {
      return action.action == userAction;
    });
    // console.log("action", action);
    if (!action) return res.send("Invalid action");

    // console.log(req.userRole);
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
