const Content = require("../models/contentModels.js");
const CONFIG = require("../configs/config");

exports.addContent = async (req, res, next) => {
  let data = {};
  data.title = req.body.title;
  data.description = req.body.description;
  try {
    let content = new Content(data);
    await content.save();
    res.status(201);
    return res.json({
      success: true,
      message: CONFIG.ADD_CONTENT_SUCCESS,
      data: content,
      accesstoken: req.accesstoken,
    });
  } catch (error) {
    next(error);
  }
};

exports.getContent = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "Content",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      return res.json({
        success: false,
        message: CONFIG.NO_CONTENT_FOUND,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getContents = async (req, res, next) => {
  try {
    let contents = await Content.find({});
    if (contents.length > 0) {
      res.status(200);
      return res.json({
        success: true,
        message: "All Content",
        data: contents,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_CONTENT_FOUND,
        data: [],
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.removeContent = async (req, res, next) => {
  let id = req.body.id;
  try {
    let result = await Content.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.DELETE_CONTENT_SUCCESS,
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: `No content with id ${id} present for deletion`,
        data: null,
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(erro);
  }
};

exports.updateContent = async (req, res, next) => {
  let id = req.body.id;
  let updatedContent = {
    title: req.body.title,
    description: req.body.description,
    content_status: 0,
  };
  try {
    let result = await Content.findOneAndUpdate(
      { _id: id },
      { $set: updatedContent },
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: CONFIG.UPDATE_CONTENT_SUCCESS,
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_CONTENT_FOUND,
        data: [],
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateContentStatus = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Content.findOneAndUpdate(
      { _id: id },
      { $set: { content_status: req.body.status } },
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "Content status updated successfully",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_CONTENT_FOUND,
        data: [],
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.contentPublish = async (req, res, next) => {
  let id = req.params.id;
  try {
    let result = await Content.findOneAndUpdate(
      { _id: id },
      { $set: { content_status: 5 } },
      { new: true }
    );
    if (result !== undefined && result !== null) {
      res.status(200);
      return res.json({
        success: true,
        message: "Content status published successfully",
        data: result,
        accesstoken: req.accesstoken,
      });
    } else {
      res.status(404);
      return res.json({
        success: false,
        message: CONFIG.NO_CONTENT_FOUND,
        data: [],
        accesstoken: req.accesstoken,
      });
    }
  } catch (error) {
    next(error);
  }
};
