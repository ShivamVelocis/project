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
} = require("../contollers/masterControllers");
const router = express.Router();

router.post("/addmodule", addModule);
router.post("/addresource", addResource);
router.post("/addmethod", addMethod);
router.get("/getmodules", getModules);
router.get("/getresources", getResources);
router.get("/getmethods", getMethods);
router.post("/mapmodule", mapResourceInModule);
router.post("/mapresource", mapModuleToResource);
router.put("/removeresource", removeResouresFromModule);
router.put("/removemethod", removemethodFromResource);
module.exports = router;
