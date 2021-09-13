const lodash = require("lodash");

const tableGenerator = (headerRow = [], data = [], widths = [], tableHeaderTextRow) => {
    if (!widths.length) {
        widths = new Array(headerRow.length).fill("*");
    }

    let tableBody = [
        tableHeaderTextRow,
        headerRow,
        ...data,
    ];

    let tableObj = {
        table: {
            widths: widths,
            headerRows: 2,
            body: tableBody.filter(Boolean),
        },
    };
    return lodash.omitBy(tableObj, lodash.isNil);
};





module.exports = { tableGenerator }