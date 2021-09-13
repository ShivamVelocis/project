/**
 * Prepare data for pdf table
 * @param {Array} columns Array object of table header columns.
 * @param {Array} data Data for table rows.
 * @param {String} headerText Table name.
 * @param {Boolean} serialNo Serial Number for table.
 * @return {Object} Retrun a object consists  headerRow, dataRows, widths, headerTextRow  .
 */
const prepareTableData = async (columns, data, headerText, serialNo) => {
    let headerRow = [];
    let dataRows = [];
    let widths = [];
    let headerTextRow = null

    if (serialNo) {
        columns.unshift({
            field: "#",
            title: "#",
            alignment: "right",
            width: "auto"
        })
    }

    columns.map((item) => {
        let newObj = {};
        newObj.text = item.title;
        newObj.bold = item.bold || true;
        newObj.alignment = item.alignment || "left";
        headerRow.push(clean(newObj));
        widths.push(item.width || "*");
    });

    if (headerText) {
        let newObj = {};
        newObj.text = headerText;
        newObj.colSpan = columns.length;
        newObj.bold = true;
        newObj.alignment = "center";
        headerTextRow = new Array(columns.length).fill({});
        headerTextRow[0] = newObj;
    }

    data.map((item, index) => {
        let temp = [];
        let newObj = {};
        columns.map((col) => {
            let val = item[col.field] || "NA";
            if (col.field == "#") {
                newObj.alignment = "right"
                newObj.bold = true;
                newObj.text = index + 1
                temp.push(newObj)
                newObj = {}
                return;
            } else if (typeof val == "number") {
                
                newObj.text = val;
                newObj.alignment = "right";
                
                temp.push(newObj);
                newObj = {}
            } else if (val instanceof Date) {
                temp.push(getFomatedDate(val));
            } else {
                temp.push(val);
            }
        });
        dataRows.push(temp);
    });

    // 


    return { headerRow, dataRows, widths, headerTextRow };
};

/**
 * Delete the key with falsy value
 * @param {Object} data Raw object.
 * @return {Object} Retrun clean object  .
 */
const clean = (data) => {
    if (Array.isArray(data)) {
        let cleanArray = data.map((item) => {
            const newObj = {};
            Object.keys(item).forEach(function (k) {
                if (item[k] && typeof item[k] === "object") {
                    newObj[k] = clean(item[k]);
                } else if (item[k] != null) {
                    newObj[k] = item[k];
                }
            });
        });
        return cleanArray;
    } else {
        const newObj = {};
        Object.keys(data).forEach(function (k) {
            if (data[k] && typeof data[k] === "object") {
                newObj[k] = clean(data[k]);
            } else if (data[k] != null) {
                newObj[k] = data[k];
            }
        });
        return newObj;
    }
};

/**
 * Change Date format to 04/03/2021
 * @param {Date} date Date.
 * @return {Object} Retrun fromated date  .
 */
const getFomatedDate = (date) => {
    let d = new Date(date);
    let datestring = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    // " " +
    // d.getHours() +
    // ":" +
    // d.getMinutes();

    return datestring;
};



module.exports = {
    prepareTableData,
    clean,
};
