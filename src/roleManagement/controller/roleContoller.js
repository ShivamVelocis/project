const Role = require("../models/rolemodel.js");
const Configs = require("../configs/config");
exports.roleForm = (req, res) => {
  res.render("roleManagement/views/addRole", { error: null });
};

exports.addRole = async (req, res) => {
	 if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    req.flash("roleData", req.body);
    return res.redirect("/role/addrole/");
  }
  try {
	 //console.log(req);
    let role = new Role(req.body);
    let saveRole = await role.save();
	// console.log(saveRole);
	req.flash("success",Configs.ADD_ROLE_SUCCESSFULLY);
    res.redirect("/role/all");
  } catch (error) {
     console.log(error);
    res.render("roleManagement/views/addRole", { error: "Error while adding role" });
    // res.render("ErrorPage", { error: "Error while adding new content" });
	
  }
};

exports.getAllRole = async (req, res) => {
  try {
    let result = await Role.find({});
    // console.log(contents)
    if (result.length > 0) {
      res.render("roleManagement/views/roleAll", { role: result,error: null,
        success: null, });
    }else {
      req.flash("error", Configs.NO_ROLE_FOUND);
      return res.render("roleManagement/views/roleAll", {
        role: [],
      });
    }
  } catch (error) {
         console.log(error);
         req.flash("error", Configs.DELETE_ROLE_FAILED);
         return res.render("roleManagement/views/roleAll", {
         role: [],
    });
	
  }
};


exports.removeRole = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Role.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
		req.flash("success", Configs.DELETE_ROLE_SUCCESSFULLY);
		res.redirect("/role/all");
    }
  } catch (error) {
	  console.log(error);
     res.status(400);
    //req.flash("success", Configs.DELETE_ROLE_SUCCESSFULLY);
    res.redirect("/role/all");
  }
};



exports.roleToUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Role.findById(id);
    if (result !== undefined && result !== null) {
      return res.render("roleManagement/views/updateRole", { oldCont: result });
    }
  } catch (error) {
    res.render("views/ErrorPage", { error: "Error while fetching role" });
    // return res.send();
  }
};


exports.updateRole = async (req, res) => {
  //console.log(req.params.id);
  let id = req.params.id;
  let updatedRole = req.body;
  try {
    let result = await Role.findOneAndUpdate(
      { _id: id },
      { $set: updatedRole },
      { new: true, upsert: true }
    );
    if (result !== undefined && result !== null) {
		req.flash(
           "success",
        Configs.UPDATE_ROLE_SUCCESSFULLY
      );
      return res.redirect("/role/all");
    }
  } catch (error) {
    res.render("src/views/ErrorPage", { error: "Error while updating content" });
    // return res.send("Error while updating content");
  }
};
exports.getRole = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await Role.findById(id);
    //console.log(result);
    if (result !== undefined && result !== null) {
      return res.render("roleManagement/views/viewRole", { role: result });
    }
  } catch (error) {
    res.render("src/views/ErrorPage", { error: "Error while fecting role" });
  }
};