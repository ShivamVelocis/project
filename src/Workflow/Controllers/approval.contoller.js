const ApprovalModel = require("../Models/approval.model");
const workflowModel = require("../Models/workflow.model");

approval = async (req, res, next) => {
  let module = req.body.module;
  let contentId = req.body.id;
  let userAction = req.body.action;
  let worlflowData = await workflowModel.find({
    "States.actions.nextState": userAction,
    Module: module,
  });

  let newObj = {};
  newObj.state = worlflowData.States.state;
  newObj.contentStatus = worlflowData.States.contentStatus;
  newObj.isStartState = worlflowData.States.isStartState;
  newObj.isTerminateState = worlflowData.States.isTerminateState;
  newObj.isStateUpdatable = worlflowData.States.isStateUpdatable;
  newObj.action = userAction;
  newObj.nextState = lodash.find(worlflowData.States.actions, function (o) {
    return action == userAction;
  }).nextState;

  console.log(newObj);

  let updateContentApproval = await ApprovalModel.findOneAndUpdate(
    {
      contentId,
    },
    {
      $set: newObj,
    }
  );
  res.send(updateContentApproval);
  // let data =await
};
