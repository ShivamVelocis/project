const WorkflowModel = require("../Models/workflow.model");
const ContentModel = require("../../ContentManagement/models/contentModels");
const lodash = require("lodash");

approvalContent = async (req, res, next) => {
  try {
    let module = req.body.module;
    let contentId = req.body.id;
    let userAction = req.body.action;
    let updatedata;

    let contentData = await ContentModel.findOne({ _id: contentId });

    if (!contentData) return res.send("Invalid Content id");

    let worlflowData = await WorkflowModel.findOne({
      "States.actions.action": contentData.content_status,
      Module: module,
    });
    if (!worlflowData || !worlflowData.States)
      return res.send("Invalid Content id");

    let state = worlflowData.States.map((state) => {
      return lodash.find(state.actions, function (action) {
        return (
          action.action == contentData.content_status &&
          action.nextState == userAction
        );
      });
    }).filter(Boolean);
    
    if (!state) return res.send("Invalid step");

    if (state && state.length > 0) {
      contentData.content_status = state[0].nextState;
      updatedata = await contentData.save();
      return res.send(updatedata);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { approvalContent };
