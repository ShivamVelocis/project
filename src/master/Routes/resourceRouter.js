const { Router } = require("express");
const router = Router();
const resourceController = require("../contollers/resourecController");
const {
  addResource,
  updateResource,
  deleteResource,
  addResourceModule,
  isRequestValid,
} = require("../middlewares/resourceValidator");

router.post("/",addResource(),isRequestValid, resourceController.addResource);
router.get("/", resourceController.getResources);
router.delete("/",  deleteResource(),isRequestValid, resourceController.deleteResource);
router.put("/",  updateResource(),isRequestValid,resourceController.updateResource);
router.put("/add-module", addResourceModule(), isRequestValid,resourceController.mapModuleToResource);
// router.put("/rm-module",  addResourceModule,resourceController.removemethodFromResource);
router.get("/:id", resourceController.getResource);

module.exports = router;
