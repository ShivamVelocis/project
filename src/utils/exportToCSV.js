import { Parser } from "json2csv";


/**
 * Export data to CSV file
 * @param {Array} headerRow List Header cells.
 * @param {Array} data Row as Array of Objects.
 * @return {Buffer} return file buffer.
 */


const exportToCSV = (headerRow, data) => {
  const json2csv = new Parser({ headerRow });
  const csv = json2csv.parse(data);
  return csv;
};

module.exports = { exportToCSV };
// const fields = [
//     {
//       label: 'First Name',
//       value: 'first_name'
//     },
//     {
//       label: 'Last Name',
//       value: 'last_name'
//     },
//     {
//      label: 'Email Address',
//       value: 'email_address'
//     }
//   ];