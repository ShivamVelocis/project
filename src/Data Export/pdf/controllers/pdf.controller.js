const pdfMake = require('pdfmake/build/pdfmake')
const pdfFonts = require('pdfmake/build/vfs_fonts')
const { prepareTableData } = require('../utils/common')
const { tableGenerator } = require('../utils/pdfElements')

pdfMake.vfs = pdfFonts.pdfMake.vfs

const pdfDownload = async (req, res, next) => {
  const columns = req.body.columns
  const pdfName = req.body.metaData.fileName
  const data = req.body.data

  try {
    const { headerRow, dataRows, widths, headerTextRow } = await prepareTableData(
      columns,
      data,
      req.body.metaData.headerText,
      req.body.metaData.serialNumber)
    const table = await tableGenerator(headerRow, dataRows, widths, headerTextRow)

    pdfMake.createPdf({ content: [table] }).getBuffer((buffer) => {
      res.writeHead(201, {
        'Content-disposition': 'attachment;filename=' + `${pdfName}.pdf`,
        'Content-Length': buffer.length
      })
      return res.end(Buffer.from(buffer, 'binary'))
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { pdfDownload }
