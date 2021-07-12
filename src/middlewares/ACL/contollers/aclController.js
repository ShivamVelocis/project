const aclModel = require("../models/aclModel");

const getAcl = async (req, res, next) => {
  aclId = req.params.id;
  try {
    let result = await aclModel.findById(aclId);
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const getAcls = async (req, res, next) => {
  try {
    let result = await aclModel.find();
    // console.log(result)
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const addACl = async (req, res, next) => {
  aclData = req.body;
  let acl = new aclModel(aclData);
  try {
    await acl.save();
    res.send("added");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const editACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  console.log(aclData);
  try {
    await aclModel.findByIdAndUpdate(
      aclId,
      { $set: aclData },
      { upsert: true }
    );
    res.send("Updated");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

const deletACl = async (req, res, next) => {
  aclId = req.params.id;
  aclData = req.body;
  try {
    await aclModel.findByIdAndRemove(aclId);
    res.send("Deleted");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

module.exports = { addACl, editACl, deletACl, getAcls, getAcl };
