const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controller")

router.post(
    "/download",
    pdfController.pdfDownload
);

module.exports = router;
