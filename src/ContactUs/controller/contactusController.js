const Contactus = require("../models/contactusModels.js");
const Configs = require("../configs/config");

exports.contactusForm = (req, res) => {
  res.render("ContactUs/views/addContactus", { error: null });
};

exports.addContactus = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contentData", req.body);
    return res.redirect("/contactus/addContactus");
  }
  let data = req.body;
  data.status = 1;
  try {
    let contactus = new Contactus(data);
    let saveContent = await contactus.save();
	// console.log(saveContent);
	req.flash("success",Configs.ADD_CONTACT_US_SUCCESSFULLY);
    res.redirect("all");
  } catch (error) {
    res.render("ContactUs/views/addContactus", {
      //error: Configs.ADD_CONTENT_FAILED,
    });
  }
};

exports.getContactus = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Contactus.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContactUs/views/viewContactus", { Contactus: result });
    }
  } catch (error) {
    req.flash("error", Configs.FETCH_CONTENT_ERROR);
    res.render("ContactUs/views/viewContactus", { Contactus: null });
  }
};

exports.getAllcontactus = async (req, res) => {
  try {
    let contactus = await Contactus.find({});
    if (contactus.length > 0) {
      return res.render("ContactUs/views/allcontactus", {
        contactus: contactus,
        error: null,
        success: null,
      });
    } else {
      req.flash("error", Configs.NO_CONTENT_FOUND);
      return res.render("ContactUs/views/allcontactus", {
        contactus: [],
      });
    }
  } catch (error) {
	  console.log(error);
    req.flash("error", Configs.DELETE_CONTENT_FAILED);
    return res.render("ContactUs/views/allcontactus", {
      contactus: [],
    });
  }
};

exports.removeContactus = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Contactus.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      let title = result.title.toUpperCase();
      req.flash("success", Configs.DELETE_CONTACT_US_SUCCESSFULLY);
      res.redirect("/contactus/all");
      // return res.render("ContentManagement/views/deleteContent", {
      //   message: `Content with title ${title} deleted successfully.`,
      // });
    } else {
      res.status(400);
      req.flash("success", `No contactus with id ${id} present for deletion`);
      res.redirect("/contactus/all");
      // res.render("ContentManagement/views/ErrorPage", {
      //   error: `no content with id ${id} present for deletion`,
      // });
    }
  } catch (error) {
    res.status(400);
    req.flash("success", Configs.DELETE_CONTENT_FAILED);
    res.redirect("/contactus/all");
  }
};

exports.contactusToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Contactus.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("ContactUs/views/updateContactus", {
        oldCont: result,
      });
    }
  } catch (error) {
    res.render("ContactUs/views/ErrorPage", {
      error: Configs.FETCH_CONTENT_ERROR,
    });
  }
};

exports.updateContactus = async (req, res) => {
  let id = req.params.id;
  let updatedContent = req.body;
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("contactusData", req.body);
    return res.redirect(`/contactus/update/${id}`);
  }
  try {
    let result = await Contactus.findOneAndUpdate(
      { _id: id },
      { $set: updatedContent },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
      req.flash(
        "success",
        Configs.UPDATE_CONTACT_US_SUCCESSFULLY
      );
      return res.redirect("/contactus/all");
    }
  } catch (error) {
    req.flash("error", Configs.UPDATE_CONTENT_FAILED);
    return res.redirect(`/contactus/update/${id}`);
  }
};
