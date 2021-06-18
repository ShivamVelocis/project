const Content = require("../models/contentModels.js");

exports.contentForm = (req, res) => {
  res.render("ContentManagement/views/addContent", { error: null });
};

exports.addContent = async (req, res) => {
  let data = req.body;
  data.status = 1;
  try {
    let content = new Content(data);
    let saveContent = await content.save();
    res.redirect("all");
  } catch (error) {
    res.render("ContentManagement/views/addContent", { error: "Error while adding content" });
  }
};

exports.getContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContentManagement/views/content", { content: result });
    }
  } catch (error) {
    res.render("ContentManagement/views/ErrorPage", { error: "Error while fecting content" });
  }
};

exports.getContents = async (req, res) => {
  // console.log("i am contents controller")
  try {
    let contents = await Content.find({});
    if (contents.length > 0) {
      res.render("ContentManagement/views/contents", {
        contents: contents,
        error: null,
        success: null,
      });
    } else {
      res.render("/ContentManagement/views/ErrorPage", { error: "No content added yet!" });
    }
  } catch (error) {
    res.render("/ContentManagement/views/ErrorPage", { error: "Unable to get any content." });
  }
};

exports.removeContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      let title = result.title.toUpperCase();
      return res.render("ContentManagement/views/deleteContent", {
        message: `Content with title ${title} deleted successfully.`,
      });
    } else {
      res.status(400);
      res.render("ContentManagement/views/ErrorPage", {
        error: `no content with id ${id} present for deletion`,
      });
    }
  } catch (error) {
    res.status(400);
    res.render("ContentManagement/views/ErrorPage", { error: "Error while deleting content" });
  }
};

exports.contentToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContentManagement/views/updateContent", { oldCont: result });
    }
  } catch (error) {
    res.render("ContentManagement/views/ErrorPage", { error: "Error while fetching content" });
  }
};

exports.updateContent = async (req, res) => {
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
    res.render("ContentManagement/views/ErrorPage", { error: "Error while updating content" });
  }
};
