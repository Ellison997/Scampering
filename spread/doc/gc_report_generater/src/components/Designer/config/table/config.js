function getActiveTable (context) {
    let spread = context.Spread;
    let sheet = spread.getActiveSheet();
    let rowIndex = sheet.getActiveRowIndex();
    let colIndex = sheet.getActiveColumnIndex();
    return sheet.tables.find(rowIndex, colIndex);
}

var tableCommands = {
    "tableExpandBoundRows": {
        text: "表格绑定扩展行",
        type: "checkbox",
        commandName: "tableExpandBoundRows",
        execute: async (context, selectValue) => {
            let table = getActiveTable(context);
            table.expandBoundRows(!table.expandBoundRows());
        },
        getState: (context) => {
            let table = getActiveTable(context);
            if (table) {
                return table.expandBoundRows();
            }
        }
    }
};


export default {
    commands: tableCommands
}