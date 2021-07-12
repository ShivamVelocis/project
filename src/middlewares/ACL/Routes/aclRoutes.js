const aclController = require('../contollers/aclController')
const express = require("express");
const router = express.Router();

router.get("/",aclController.getAcls)
router.get("/:id",aclController.getAcl)
router.post('/add',aclController.addACl); 
router.post("/edit/:id",aclController.editACl);
router.post("/delete/:id",aclController.deletACl); 


module.exports = router;