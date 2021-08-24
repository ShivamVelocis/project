const { Router } = require("express");
const router = Router();
const statusControllers = require("../contollers/statusContoroller");

router
  .get("/", statusControllers.getAllStatus)
  .put("/", statusControllers.addStatus)
  .put("/", statusControllers.updateStatus)
  .delete("/", statusControllers.deleteStatus);

router.get("/:id", statusControllers.getStatus);

module.exports = router;
