const Feedback = require("../models/feedbackModels.js");
const Configs = require("../configs/config");

exports.feedbackForm = (req, res) => {
  res.render("FeedbackManagement/views/addFeedback", { error: null });
};

exports.addFeedback = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("feedbackData", req.body);
    return res.redirect("/feedback/addFeedback");
  }
  let data = req.body;
  //console.log(data);
  data.status = 1;
  try {
    let feedback = new Feedback(data);
	
    let saveFeedback = await feedback.save();
	req.flash("success",Configs.ADD_FEEDBACK_SUCCESSFULLY);
    res.redirect("all");
  } catch (error) {
	  console.log(error);
    res.render("FeedbackManagement/views/addFeedback", {
      //error: Configs.ADD_CONTENT_FAILED,
    });
  }
};

exports.getFeedback = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Feedback.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("FeedbackManagement/views/viewFeedback", { Feedback: result });
    }
  } catch (error) {
    req.flash("error", Configs.FETCH_CONTENT_ERROR);
    res.render("FeedbackManagement/views/viewFeedback", { Feedback: null });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    let feedback = await Feedback.find({});
    if (feedback.length > 0) {
      return res.render("FeedbackManagement/views/allfeedback", {
        feedback: feedback,
        error: null,
        success: null,
      });
    } else {
      req.flash("error", Configs.NO_CONTENT_FOUND);
      return res.render("FeedbackManagement/views/allfeedback", {
        feedback: [],
      });
    }
  } catch (error) {
	  console.log(error);
    req.flash("error", Configs.DELETE_CONTENT_FAILED);
    return res.render("FeedbackManagement/views/allfeedback", {
      feedback: [],
    });
  }
};

exports.removeFeedback = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Feedback.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      let title = result.title.toUpperCase();
      req.flash("success", Configs.DELETE_FEEDBACK_SUCCESSFULLY);
      res.redirect("/feedback/all");
      // return res.render("ContentManagement/views/deleteContent", {
      //   message: `Content with title ${title} deleted successfully.`,
      // });
    } else {
      res.status(400);
      req.flash("success", `No feedback with id ${id} present for deletion`);
      res.redirect("/feedback/all");
      // res.render("ContentManagement/views/ErrorPage", {
      //   error: `no content with id ${id} present for deletion`,
      // });
    }
  } catch (error) {
    res.status(400);
    req.flash("success", Configs.DELETE_CONTENT_FAILED);
    res.redirect("/feedback/all");
  }
};

exports.feedbackToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Feedback.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("FeedbackManagement/views/updateFeedback", {
        oldCont: result,
      });
    }
  } catch (error) {
	  console.log(error);
    res.render("FeedbackManagement/views/ErrorPage", {
      error: Configs.FETCH_CONTENT_ERROR,
    });
  }
};

exports.updateFeedback = async (req, res) => {
  let id = req.params.id;
  let updatedContent = req.body;
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contactusData", req.body);
    return res.redirect(`/feedback/update/${id}`);
  }
  try {
    let result = await Feedback.findOneAndUpdate(
      { _id: id },
      { $set: updatedContent },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
      req.flash(
        "success",
        Configs.UPDATE_FEEDBACK_SUCCESSFULLY
      );
      return res.redirect("/feedback/all");
    }
  } catch (error) {
    req.flash("error", Configs.UPDATE_CONTENT_FAILED);
    return res.redirect(`/contactus/update/${id}`);
  }
};
