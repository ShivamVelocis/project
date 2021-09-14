const express = require('express')
const router = express.Router()
const pdfController = require('../controllers/pdf.controller')
const Validtor = require('../middlewares/validator')

router.post(
  '/download',
  Validtor.pdfJsonBody(),
  Validtor.isRequestValid,
  pdfController.pdfDownload
)

module.exports = router
