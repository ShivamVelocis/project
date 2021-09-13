const prepareTableData = async (columns, data, headerText) => {
    let headerRow = [];
    let dataRows = [];
    let widths = [];
    let headerTextRow = null

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

    data.map((item) => {
        let temp = [];
        columns.map((col) => {
            let val = item[col.field] || "NA";
            if (typeof val == "number") {
                let newObj = {};
                newObj.text = val;
                newObj.alignment = "right";
                temp.push(newObj);
            } else if (val instanceof Date) {
                temp.push(getFomatedDate(val));
            } else {
                temp.push(val);
            }
        });
        dataRows.push(temp);
    });

    return { headerRow, dataRows, widths, headerTextRow };
};


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

const getFomatedDate = (date) => {
    let d = new Date(date);
    console.log("d: ", d);
    let datestring =
        d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
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
