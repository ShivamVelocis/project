const ExcelJS = require("exceljs");
const lodash = require("lodash");

/**
 * Export data to Excel file
 * @param {Array} headerRow List Header cells.
 * @param {Array} data Row as Array of Objects.
 * @param {string} sheetName Excel sheet name.
 * @return {Buffer} return file buffer.
 */
const exportToExcel = async (headerRow, data, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = headerRow;
  let headRow = worksheet.getRow(1);
  headRow.eachCell(function (cell, colNumber) {
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

  let excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
  // .then((buffer) => saveAs(new Blob([buffer]), `${Date.now()}_users.xlsx`))
  // .catch((err) => console.log("Error writing excel export", err));
};
let reformatHeaderWord = (word) => {
  let words = word.split("_");
  let newWord = "";
  words.map((word) => {
    newWord += word.replace(/^./, (str) => str.toUpperCase()) + " ";
  });
  return newWord;
};
const generateHeaderRow = (data = [], ignoreKeys = []) => {

  data = JSON.parse(JSON.stringify(data));
  // console.log(data)
  let headerRow = [];
  for (const [key, value] of Object.entries(data[0])) {
    if (!ignoreKeys.includes(key)) {
      let newObj = {};
      newObj.header = reformatHeaderWord(key);
      newObj.key = key;
      newObj.width = JSON.stringify(value).length + 10;
      headerRow.push(newObj);
    }
  }
  let restructureData = data.map((item) => {
    let newObject = {};
    headerRow.map(({ header, key }) => {
      if (
        typeof lodash.get(item, key) == "string" ||
        typeof lodash.get(item, key) == "number"
      ) {
        newObject[key] = lodash.get(item, key);
      } else if (typeof lodash.get(item, key) == "object") {
        let concatedObject = "";
        let subObj = lodash.get(item, key);
        for (const [key, value] of Object.entries(subObj)) {
          concatedObject += value + " ";
        }
        newObject[key] = concatedObject;
      } else if (Array.isArray(lodash.get(item, key))) {
        newObject[key] = lodash.get(item, key).join(" ");
      }
    });
    return newObject;
  });
  return [headerRow, restructureData];
};

module.exports = { exportToExcel, generateHeaderRow };

// [{
//     header: 'First Name',
//     key: 'name.first_name',
//     width: 20
// },
// {
//     header: 'Last Name',
//     key: 'name.last_name',
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
