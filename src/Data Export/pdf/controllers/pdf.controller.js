const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts')
const { prepareTableData } = require('../utils/common')
const { tableGenerator } = require('../utils/pdfElements')

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const pdfDownload = async (req, res, next) => {
    let columns = req.body.columns;
    let pdfName = req.body.fileName;
    let data = req.body.data;
    
    try {
        let { headerRow, dataRows, widths, headerTextRow } = await prepareTableData(columns, data, req.body.headerText);
        let table = await tableGenerator(headerRow, dataRows, widths, headerTextRow)

        pdfMake.createPdf({ content: [table] }).getBuffer((buffer) => {
            res.writeHead(201, {
                "Content-disposition": "attachment;filename=" + `${pdfName}.pdf`,
                "Content-Length": buffer.length,
            });
            return res.end(Buffer.from(buffer, "binary"));
        });
    } catch (error) {
        next(error)
    }
};



module.exports = { pdfDownload };
