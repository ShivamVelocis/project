const aclController = require("../contollers/aclController");
const express = require("express");
const router = express.Router();

router.get("/", aclController.getAcls);
router.get("/add", aclController.addACl);
router.post("/add", aclController.postAddACl);
router.get("/:id", aclController.getAcl);
router.get("/edit/:id", aclController.editACl);
router.post("/edit/:id", aclController.postEditACl);
router.post("/delete/:id", aclController.postDeletACl);

module.exports = router;
