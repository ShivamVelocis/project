const express = require("express");
const router = express.Router();
const moduleController = require("../contollers/moduleControllers");
const {
  addModule,
  updateModule,
  deleteModule,
  removeModuleResource,
  addModuleResource,
  isRequestValid,
} = require("../middlewares/moduleValidators");

router.post("/", addModule(),isRequestValid, moduleController.addModule);
router.get("/", moduleController.getModules);
router.delete("/", deleteModule(),isRequestValid, moduleController.deleteModule);
router.put("/",  updateModule(),isRequestValid,moduleController.updateModule);
router.put("/add-resource",addModuleResource(), isRequestValid,moduleController.mapResourceInModule);
router.put("/rm-resource", removeModuleResource(), isRequestValid,moduleController.removeResouresFromModule);
router.get("/:id", moduleController.getModule);

module.exports = router;
