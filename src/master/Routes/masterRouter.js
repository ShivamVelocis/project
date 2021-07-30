const express = require("express");
const {
  addModule,
  addResource,
  addMethod,
  getMethods,
  getResources,
  getModules,
  mapResourceInModule,
  mapModuleToResource,
  removeResouresFromModule,
  removemethodFromResource,
  deleteModule,
  updateModule,
  getModule,
  getResource,
  updateResource,
  getMethod,
  deleteMethod,
  updateMethod,
  deleteResource,
} = require("../contollers/masterControllers");
const router = express.Router();

router.post("/addmodule", addModule);
router.get("/getmodules", getModules);
router.post("/getmodule", getModule);
router.delete("/deletemodule", deleteModule);
router.put("/updatemodule", updateModule);

router.post("/addresource", addResource);
router.get("/getresources", getResources);
router.post("/getresource", getResource);
router.delete("/deleteresource", deleteResource);
router.put("/updateresource", updateResource);

router.get("/getmethods", getMethods);
router.post("/addmethod", addMethod);
router.post("/getmethod", getMethod);
router.delete("/deletemethod", deleteMethod);
router.put("/updatemethod", updateMethod);

router.post("/mapmodule", mapResourceInModule);
router.post("/mapresource", mapModuleToResource);
router.put("/removeresource", removeResouresFromModule);
router.put("/removemethod", removemethodFromResource);
module.exports = router;
