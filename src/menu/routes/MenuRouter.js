const express = require("express");
const router = express.Router();
const controller = require("./../controllers/MenuController");
const validationRule = require('./../validations/MenuValidation');

//router.get("/add-menu", controller.addMenu);
router.post("/add-menu", validationRule.addMenu, controller.postAddMenu);
router.get("/all", controller.getAllMenu);
router.get("/view-menu/:id", controller.getMenu);
router.get("/update-menu/:id", controller.updateMenu);
router.post("/update-menu/:id", validationRule.updateMenu, controller.postUpdateMenu);
/*router.get("/delete-menu/:id", mongoIDValidationRules(), controller.removeMenu);
router.post("/delete-menu/:id", controller.postRemoveMenu); //deletes user with id given in url
*/
//router.get("/pdf", controller.generatePdf);
//router.get("/html-pdf", controller.generateHtmlToPdf);

module.exports = router;
