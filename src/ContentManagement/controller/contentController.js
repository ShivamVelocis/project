const Content = require("../models/contentModels.js");

exports.contentForm = (req, res) => {
  res.render("ContentManagement/views/addContent", { error: null });
};

exports.addContent = async (req, res) => {
  console.log(res.locals.validationError);
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contentData", req.body);
    return res.redirect("/content/");
  }
  let data = req.body;
  data.status = 1;
  try {
    let content = new Content(data);
    let saveContent = await content.save();
    res.redirect("all");
  } catch (error) {
    res.render("ContentManagement/views/addContent", {
      error: "Error while adding content",
    });
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
    req.flash("error", "Error while fecting content");
    res.render("ContentManagement/views/content", { content: null });
  }
};

exports.getContents = async (req, res) => {
  // console.log("i am contents controller")
  try {
    let contents = await Content.find({});
    if (contents.length > 0) {
      return res.render("ContentManagement/views/contents", {
        contents: contents,
        error: null,
        success: null,
      });
    } else {
      req.flash("error", "No content added yet!");
      return res.render("ContentManagement/views/contents", {
        contents: [],
      });
    }
  } catch (error) {
    req.flash("error", "Error encountered while fetching content");
    return res.render("ContentManagement/views/contents", {
      contents: [],
    });
  }
};

exports.removeContent = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Content.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      let title = result.title.toUpperCase();
      req.flash("success", `Content with title ${title} deleted successfully.`);
      res.redirect("/content/all");
      // return res.render("ContentManagement/views/deleteContent", {
      //   message: `Content with title ${title} deleted successfully.`,
      // });
    } else {
      res.status(400);
      req.flash("success", `No content with id ${id} present for deletion`);
      res.redirect("/content/all");
      // res.render("ContentManagement/views/ErrorPage", {
      //   error: `no content with id ${id} present for deletion`,
      // });
    }
  } catch (error) {
    res.status(400);
    req.flash("success", `Error while deleting content`);
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
      });
    }
  } catch (error) {
    res.render("ContentManagement/views/ErrorPage", {
      error: "Error while fetching content",
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
        `Content with Title ${req.body.title} updated successfully`
      );
      return res.redirect("/content/all");
    }
  } catch (error) {
    req.flash("error", `Error encountered while updating content`);
    return res.redirect(`/content/update/${id}`);
    res.render("ContentManagement/views/ErrorPage", {
      error: "Error while updating content",
    });
  }
};
