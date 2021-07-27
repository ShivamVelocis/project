const { Parser }  =require("json2csv");


/**
 * Export data to CSV file
 * @param {Array} headerRow List Header cells.
 * @param {Array} data Row as Array of Objects.
 * @return {Buffer} return file buffer.
 */


const exportDataToCSV = (headerRow, data) => {
  const fields = [
        {
          label: 'First Name',
          value: 'first_name'
        },
        {
          label: 'Last Name',
          value: 'last_name'
        },
        {
         label: 'Email Address',
          value: 'email'
        },
        {
          label: 'Username',
           value: 'username'
         }
      ];
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  return csv;
};

module.exports = { exportDataToCSV };
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