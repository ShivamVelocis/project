const { prepareDataForExcel, exportDataToExcel } = require('../utils/jsonToExcel')

const excelDownload = async (req, res) => {
  const columns = req.body.columns
  const sheetName = req.body.fileName
  const data = req.body.data

  try {
    const [headerRow, restructureData] = prepareDataForExcel(data, columns)
    const excelBuffer = await exportDataToExcel(headerRow, restructureData, sheetName)

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `${sheetName}.xlsx`
    )

    return res.send(excelBuffer)
  } catch (error) {
    console.log('Error : ', error)
  }
}

module.exports = { excelDownload }
