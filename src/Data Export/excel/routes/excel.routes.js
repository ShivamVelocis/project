const express = require('express')
const router = express.Router()
const excelController = require('../controllers/excel.controller')
const Validtor = require('../middleware/validator')

router.post(
  '/download',
  Validtor.excelJsonFile(),
  Validtor.isRequestValid,
  excelController.excelDownload
)

module.exports = router
