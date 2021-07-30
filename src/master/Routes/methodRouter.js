const { Router } = require("express");
const router = Router();
const methodController = require("../contollers/methodController");

router.get("/", methodController.getMethods);
router.post("/", methodController.addMethod);
router.delete("/", methodController.deleteMethod);
router.put("/", methodController.updateMethod);
router.get("/:id", methodController.getMethod);

module.exports = router;
