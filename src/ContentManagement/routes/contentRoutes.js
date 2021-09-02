const express = require("express");
const router = express.Router();

const controller = require("../controller/contentController");
const {addContentRules,updateContentRule,deleteContentRule,getContentRule,isRequestValid,} = require("../middlewares/validater");

router.post("/", addContentRules(), isRequestValid, controller.addContent);
router.get("/", controller.getContents);
router.put("/",updateContentRule(), isRequestValid, controller.updateContent);
router.delete("/",deleteContentRule(),isRequestValid,controller.removeContent);
router.get("/:id", getContentRule(),isRequestValid,controller.getContent);
router.put("/:id", controller.updateContentStatus);
router.put("/publish/:id", controller.contentPublish);


module.exports = router;
