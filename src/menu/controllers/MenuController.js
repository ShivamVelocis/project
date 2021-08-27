const { check, validationResult } = require('express-validator');

const menuModel = require("../models/MenuModel");
const CONFIG = require("./../config/config");

exports.postAddMenu = async function addMenu(req, res, next) {
  try {
    var form_data = {
      menu_title: req.body.menu_title,
      menu_link: req.body.menu_link,
      menu_status: req.body.menu_status,
      menu_priority: req.body.menu_weight,
      sub_menu: {},
    }

    //Validation
    let errorsExtract = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach((item) => {
        errorsExtract.push(item.msg);
      })
      res.json({
        page_title: CONFIG.ADD_TITLE,
        module_title: CONFIG.MODULE_TITLE,
        formData: form_data
      });
    } else {

      let Menu = new menuModel(form_data);
      let saveMenu = await Menu.save();
      res.json({ 'success' : true,'messaage' : 'Added Successfully' });
    }
  } catch (error) {
    //req.flash('error', error.errors);
    //console.log(error.message);

    res.json({ 'success' : false, page_title: CONFIG.ADD_TITLE, module_title: CONFIG.MODULE_TITLE, error: error });
  }
};



exports.updateMenu = async (req, res) => {
  let id = req.params.id;
  try {
    let result = await menuModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.json({ page_title: CONFIG.UPDATE_TITLE, module_title: CONFIG.MODULE_TITLE, results: result });
    }
  } catch (error) {
    res.json({ error: "Error while fetching content" });
  }
};

exports.postUpdateMenu = async (req, res) => {
  // console.log(req.params.id);
  let id = req.params.id;
  let updatedContent = req.body;

  var form_data = {
    menu_title: req.body.menu_title,
    menu_link: req.body.menu_link,
    menu_status: req.body.menu_status,
    menu_priority: req.body.menu_weight,
    sub_menu: {},
  }

  let result = await menuModel.findById(id);

  //Validation
  let errorsExtract = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorsExtract.push(item.msg);
    })
    //req.flash('error', errorsExtract);
    res.json({ page_title: CONFIG.UPDATE_TITLE, module_title: CONFIG.MODULE_TITLE, results: form_data });
  } else {

    try {
      let result = await menuModel.findOneAndUpdate(
        { _id: id },
        { $set: form_data },
        { new: true, upsert: true }
      );
      if (result !== undefined && result !== null) {
        req.json({'success': CONFIG.UPDATE_MESSAGE});
        //return res.redirect("/menu/all");
      }
    } catch (error) {
      //req.flash('error', 'Something went wrong!!');
      res.json({ error: "Error while updating content" });
    }
  }
}



//render user with given ID
exports.getMenu = async function getMenu(req, res, next) {

  let id = req.params.id;
  try {
    let result = await menuModel.findById(id);
    if (result !== undefined && result !== null) {
      return res.json({
        page_title: CONFIG.LIST_OF_PAGE,
        module_title: CONFIG.MODULE_TITLE,
        records: result,
      });
    }
  } catch (error) {
    res.json({
      error: "Error while fecting content",
    });
  }
};

//render list of users
exports.getAllMenu = async function getAllMenu(req, res, next) {
  try {
    let menus = await menuModel.find({});
    if (menus.length > 0) {
      res.json({
        page_title: CONFIG.LIST_OF_PAGE,
        module_title: CONFIG.MODULE_TITLE,
        records: menus,
      });
    } else {
      res.json({ error: "No content added yet!" });
    }
  } catch (error) {
    res.json({ error: "Unable to get any content" });
  }
};

// remove/delete user from db with given ID
exports.removeContent = async (req, res) => {
  if (res.locals.validationError) {
    req.flash("error", res.locals.validationError);
    return res.json({
      error: res.locals.validationError,
    });
  }
  let id = req.body.uid;
  try {
    let result = await userModel.findOneAndRemove({ _id: id });
    if (result !== undefined && result !== null) {
      req.json({"success": CONFIG.DELETE_MESSAGE});
     // res.redirect("/user/view");
    }
  } catch (error) {
    res.json({
      error: "Error while deleting content",
    });
  }
};


exports.generatePdf = async (req, res) => {

  var fs = require("fs");
  var pdf = require("pdf-creator-node");

  // Read HTML Template
  //console.log(__dirname);
  var html = fs.readFileSync(__dirname + "/../views/pdf_template.ejs", "utf8");

  var options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Author: Dilip Kumar</div>'
    },
    footer: {
      height: "28mm",
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page'
      }
    }
  };


  let students = [
    {
      name: "Joy",
      email: "joy@example.com",
      city: "New York",
      country: "USA"
    },
    {
      name: "John",
      email: "John@example.com",
      city: "San Francisco",
      country: "USA"
    },
    {
      name: "Clark",
      email: "Clark@example.com",
      city: "Seattle",
      country: "USA"
    },
    {
      name: "Watson",
      email: "Watson@example.com",
      city: "Boston",
      country: "USA"
    },
    {
      name: "Tony",
      email: "Tony@example.com",
      city: "Los Angels",
      country: "USA"
    }];

  var document = {
    html: html,
    data: {
      records: students
    },
    path: "./public/files/download/output.pdf",
    type: "",
  };
  // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.


  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  return
  //return res.render('menu/views/menu/list',{results : ''});
};


/*
exports.generateHtmlToPdf = async (req, res) => {

  var html_to_pdf = require('html-pdf-node');
let options = { format: 'A4' };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
// or //
//let file = { url: "http://localhost:3000/" };
html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  console.log("PDF Buffer:-", pdfBuffer);
});

};
*/