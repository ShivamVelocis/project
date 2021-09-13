const { prepareDataForExcel, exportDataToExcel, } = require("../utils/jsonToExcel");

const excelDownload = async (req, res) => {
  
  let columns = req.body.columns;
  let sheetName = req.body.fileName;
  let data = req.body.data;

  try {
    let [headerRow, restructureData] = prepareDataForExcel(data, columns);
    let excelBuffer = await exportDataToExcel(headerRow, restructureData, sheetName);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${sheetName}.xlsx`
    );

    return res.send(excelBuffer);

  } catch (error) {
    console.log("Error : ", error);
  }
};

module.exports = { excelDownload };
