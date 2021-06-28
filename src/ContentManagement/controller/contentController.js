const Content = require("../models/contentModels.js");
const CONFIG = require("../configs/config");

exports.contentForm = (req, res) => {
  res.render("ContentManagement/views/addContent", {
    module_title: CONFIG.MODULE_TITLE,
    title: CONFIG.ADD_TITLE,
  });
};

exports.addContent = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contentData", req.body);
    return res.redirect("/content/");
  }
  let data = req.body;
  try {
    let content = new Content(data);
    await content.save();
    req.flash("success", CONFIG.ADD_CONTENT_SUCCESS);
    res.redirect("all");
  } catch (error) {
    req.flash("error", CONFIG.ADD_CONTENT_FAILED);
    res.render("ContentManagement/views/addContent", {
      module_title: CONFIG.MODULE_TITLE,
    });
  }
};

exports.getContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContentManagement/views/content", {
        content: result,
        module_title: CONFIG.MODULE_TITLE,
        title: CONFIG.CONTENT,
      });
    }
  } catch (error) {
    req.flash("error", CONFIG.FETCH_CONTENT_ERROR);
    res.render("ContentManagement/views/content", {
      content: null,
      module_title: CONFIG.MODULE_TITLE,
    });
  }
};

exports.getContents = async (req, res) => {
  try {
    let contents = await Content.find({});
    if (contents.length > 0) {
      return res.render("ContentManagement/views/contents", {
        contents: contents,
        module_title: CONFIG.MODULE_TITLE,
      });
    } else {
      req.flash("error", CONFIG.NO_CONTENT_FOUND);
      return res.render("ContentManagement/views/contents", {
        contents: [],
        module_title: CONFIG.MODULE_TITLE,
      });
    }
  } catch (error) {
    req.flash("error", CONFIG.DELETE_CONTENT_FAILED);
    return res.render("ContentManagement/views/contents", {
      contents: [],
      module_title: CONFIG.MODULE_TITLE,
    });
  }
};

exports.removeContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      req.flash("success", CONFIG.DELETE_CONTENT_SUCCESS);
      res.redirect("/content/all");
    } else {
      res.status(400);
      req.flash("success", `No content with id ${id} present for deletion`);
      res.redirect("/content/all");
    }
  } catch (error) {
    res.status(400);
    req.flash("success", CONFIG.DELETE_CONTENT_FAILED);
    res.redirect("/content/all");
  }
};

exports.contentToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContentManagement/views/updateContent", {
        oldCont: result,
        module_title: CONFIG.MODULE_TITLE,
        title: CONFIG.UPDATE_TITLE,
      });
    }
  } catch (error) {
    req.flash("error", CONFIG.FETCH_CONTENT_ERROR);
    return res.render("ContentManagement/views/updateContent", {
      oldCont: result,
      module_title: CONFIG.MODULE_TITLE,
    });
  }
};

exports.updateContent = async (req, res) => {
  let id = req.params.id;
  let updatedContent = req.body;
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contentData", req.body);
    return res.redirect(`/content/update/${id}`);
  }
  try {
    let result = await Content.findOneAndUpdate(
      { _id: id },
      { $set: updatedContent },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
      req.flash(
        "success",
        CONFIG.UPDATE_CONTENT_SUCCESS
      );
      return res.redirect("/content/all");
    }
  } catch (error) {
    req.flash("error", CONFIG.UPDATE_CONTENT_FAILED);
    return res.redirect(`/content/update/${id}`);
  }
};
