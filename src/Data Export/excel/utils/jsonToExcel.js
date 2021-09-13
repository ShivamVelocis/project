const ExcelJS = require("exceljs");
const CONFIG = require("../configs/excel.configs")



/**
 * PrepareData to for excel file
 * @param {Array} data raw data for excel file.
 * @param {Array} keysToBeInclude Column key to be added to Excel file.
 * @return {Array} headerRow and restructureData .
 */
const prepareDataForExcel = (data = [], columns = []) => {
  data = JSON.parse(JSON.stringify(data));
  let headerRow = [];
  columns.map((column) => {
    let newObj = {};
    newObj.header = column.title;
    newObj.key = column.field;
    newObj.width = getLargestColumnWidth(column.field, data) + 10;
    headerRow.push(newObj);
  });
  let restructureData = data.map((item) => {
    let newObj = {};
    columns.map((col) => {
      newObj[col.field] = item[col.field] || "NA";
    });
    return newObj;
  });
  return [headerRow, restructureData];
};

const getLargestColumnWidth = (colName, data) => {
  let largestCol = 0;
  data.map((item) => {
    if (item[colName]) {
      if (item[colName].toString().length > largestCol) {
        largestCol = item[colName].toString().length;
      }
    }
  });

  largestCol = colName.length > largestCol ? colName.length : largestCol;

  return largestCol;
};

/**
 * Export data to Excel file
 * @param {Array} headerRow List Header cells.
 * @param {Array} data Row as Array of Objects.
 * @param {string} sheetName Excel sheet name.
 * @return {Buffer} return file buffer.
 */
const exportDataToExcel = async (headerRow, data, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = headerRow;
  data.map((item) => {
    worksheet.addRow(item);
  });

  worksheet.eachRow(function (row, rowNumber) {
    row.eachCell((cell) => {
      if (rowNumber == 1) {
        cell.fill = {
          type: CONFIG.headerRowType,
          pattern: CONFIG.headerRowPattern,
          fgColor: {
            argb: CONFIG.headerRowBgColour,
          },
        };
      }

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row.commit();
  });
  let excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
};

module.exports = { exportDataToExcel, prepareDataForExcel };
