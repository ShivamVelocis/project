const Content = require("../models/content.js");

exports.contentForm = (req, res) => {
  res.render("addContent", { error: null });
};

exports.addContent = async (req, res) => {
  try {
    let content = new Content(req.body);
    let saveContent = await content.save();
    // console.log(saveContent);
    res.redirect("all");
  } catch (error) {
    // console.log(error.message);
    res.render("addContent", { error: "Error while adding content" });
    // res.render("ErrorPage", { error: "Error while adding new content" });
  }
};

exports.getContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("content", { content: result });
    }
  } catch (error) {
    res.render("ErrorPage", { error: "Error while fecting content" });
  }
};

exports.getContents = async (req, res) => {
  try {
    let contents = await Content.find({});
    // console.log(contents)
    if (contents.length > 0) {
      res.render("contents", { contents: contents });
    }else{
      res.render("ErrorPage", { error: "No content added yet!" });
    }
  } catch (error) {
    res.render("ErrorPage", { error: "Unable to get any content" });
  }
};

exports.removeContent = async (req, res) => {
  let id = req.params.id;
  // console.log(id);
  try {
    let result = await Content.findOneAndRemove({ _id: id });
    // console.log(result);
    if (result !== undefined && result !== null) {
      return res.send(result);
    }
  } catch (error) {
    // console.log(error);
    res.render("ErrorPage", { error: "Error while deleting content" });
  }
};

exports.contentToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("updateContent", { oldCont: result });
    }
  } catch (error) {
    res.render("ErrorPage", { error: "Error while fetching content" });
  }
};

exports.updateContent = async (req, res) => {
  // console.log(req.params.id);
  let id = req.params.id;
  let updatedContent = req.body;
  try {
    let result = await Content.findOneAndUpdate(
      { _id: id },
      { $set: updatedContent },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
      return res.redirect("/content/all");
    }
  } catch (error) {
    res.render("ErrorPage", { error: "Error while updating content" });
  }
};
