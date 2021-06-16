const express = require("express");
const router = express.Router();
const controller = require("../controller/content");

router.get("/", controller.contentForm);
router.post("/", controller.addContent);
router.get("/all", controller.getContents);
router.get("/:id", controller.getContent);
router.get("/update/:id", controller.contentToUpdate);
router.post("/updateContent/:id", controller.updateContent);
router.delete("/:id", controller.removeContent);

module.exports = router;
