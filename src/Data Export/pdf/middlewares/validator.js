const { body, validationResult } = require('express-validator')
const localization = require('../configs/Localization')

const pdfJsonBody = () => {
  return [
    body('metaData.fileName').exists().withMessage(localization.EMPTY_FILENAME),
    body('metaData.headerText').exists().withMessage(localization.INVALID_HEADERTEXT),
    body('metaData.serialNumber').exists().withMessage(localization.INVALID_SERIAL_NUMBER)
      .isBoolean().withMessage(localization.INVALID_SERIAL_NUMBER),

    body('columns')
      .exists()
      .withMessage(localization.EMPTY_COLUMNS)
      .isArray()
      .withMessage(localization.INVALID_COLUMNS),

    body('columns.*')
      .exists()
      .withMessage(localization.EMPTY_COLUMNS)
      .isObject()
      .withMessage(localization.INVALID_COLUMN_OBJECT)
      .custom((value) => {
        if (value.title) {
          if (!value.field) {
            throw new Error(localization.EMPTY_COLUMN_FIELD)
          }
        }
        if (value.field) {
          if (!value.title) {
            throw new Error(localization.EMPTY_COLUMN_TITLE)
          }
        }
        if (value.alignment && !['left', 'right', 'center'].includes(value.alignment)) {
          throw new Error(localization.INVALID_TEXT_ALIGNMENT)
        }
        return true
      }),

    body('data')
      .exists()
      .withMessage(localization.EMPTY_DATA)
      .isArray()
      .withMessage(localization.INVALID_DATA)
  ]
}

const isRequestValid = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))
  if (extractedErrors) {
    res.status(400)
    return res.json({ success: false, message: extractedErrors, data: null })
  }
  next()
}

module.exports = { pdfJsonBody, isRequestValid }
