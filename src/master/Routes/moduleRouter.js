const express = require("express");
const router = express.Router();
const moduleController = require("../contollers/moduleControllers");

router.post("/", moduleController.addModule);
router.get("/", moduleController.getModules);
router.delete("/", moduleController.deleteModule);
router.put("/", moduleController.updateModule);
router.put("/add-resource", moduleController.mapResourceInModule);
router.put("/rm-resource", moduleController.removeResouresFromModule);
router.get("/:id", moduleController.getModule);

module.exports = router;
