const ExcelJS = require("exceljs");

/**
 * Export data to Excel file
 * @param {Array} headerRow List Header cells.
 * @param {Array} data Row as Array of Objects.
 * @param {string} sheetName Excel sheet name.
 * @return {Buffer} return file buffer.
 */
exportToExcel = async (headerRow, data,sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = headerRow;
  let headerRow = worksheet.getRow(1);
  headerRow.eachCell(function (cell, colNumber) {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "cccccc",
      },
    };
  });
  data.map((user) => {
    worksheet.addRow(user);
  });

  return await workbook.xlsx.writeBuffer();
  // .then((buffer) => saveAs(new Blob([buffer]), `${Date.now()}_users.xlsx`))
  // .catch((err) => console.log("Error writing excel export", err));
};

module.exports = { exportToExcel };

// [{
//     header: 'First Name',
//     key: 'first_name',
//     width: 20
// },
// {
//     header: 'Last Name',
//     key: 'last_name',
//     width: 20
// },
// {
//     header: 'Username',
//     key: 'username',
//     width: 15,
// },
// {
//     header: 'Email',
//     key: 'email',
//     width: 30,
// },
// {
//     header: 'Status',
//     key: 'status',
//     width: 15,
// }
// ];
