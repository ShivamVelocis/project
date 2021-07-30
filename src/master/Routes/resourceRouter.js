const { Router } = require("express");
const router = Router();
const resourceController = require("../contollers/resourecController");

router.post("/", resourceController.addResource);
router.get("/", resourceController.getResources);
router.delete("/", resourceController.deleteResource);
router.put("/", resourceController.updateResource);
router.put("/add-module", resourceController.mapModuleToResource);
router.put("/rm-module", resourceController.removemethodFromResource);
router.get("/:id", resourceController.getResource);

module.exports = router;
