const cellRuleDialogTemplateName = "cellRuleTemplate"
var contextMenuCellRuleCammand = {
    text: "单元格配置",
    commandName: "contextMenuCellRule",
    visibleContext:"ClickViewport",
    execute: (content) =>{
        let sheet = content.getWorkbook().getActiveSheet();
        var tag = sheet.getCell(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex()).tag()
        GC.Spread.Sheets.Designer.showDialog(cellRuleDialogTemplateName, tag || {}, (result) => {
            console.log(result);
            let selections = sheet.getSelections();
            if(selections && selections.length){
                sheet.suspendPaint();
                selections.forEach(selection => {
                    let row = selection.row === -1 ? 0 : selection.row;
                    let rowCount = selection.row === -1 ? sheet.getRowCount() : selection.rowCount;
                    let col = selection.col === -1 ? 0 : selection.col;
                    let colCount = selection.col === -1 ? sheet.getColumnCount() : selection.colCount;
                    for(var i= row ;i < row + rowCount; i++){
                        for(var j = col; j < col + colCount; j++){
                            let cell = sheet.getCell(i, j)
                            cell.tag(result)
                        }
                    }
                    
                });
                sheet.resumePaint();
            }


        });
    }
}

var cellRuleDialogTemplate = {
    title: "单元格权限控制",
    templateName: cellRuleDialogTemplateName,
    content: [
        {
            type: "FlexContainer", 
            children: [
                {
                    margin: "10px",
                    type: "ColumnSet",
                    children:[
                        {
                            type: "Column",
                            width: "290px",
                            children: [
                                {type: "LabelLine", text: "权限设置"},
                                {
                                    bindingPath: "rule.sys",
                                    text: "系统生成",
                                    margin: "2px 10px",
                                    type: "CheckBox"
                                },
                                {
                                    bindingPath: "rule.admin",
                                    text: "管理员",
                                    margin: "2px 10px",
                                    type: "CheckBox"
                                },
                                {
                                    bindingPath: "rule.user",
                                    text: "用户",
                                    margin: "2px 10px",
                                    type: "CheckBox"
                                },
                                {type: "LabelLine", text: "展示类型"},
                                {
                                    bindingPath: "signature",
                                    text: "图片单元格",
                                    margin: "2px 10px",
                                    type: "CheckBox"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

var templates = {};
templates[cellRuleDialogTemplateName] = cellRuleDialogTemplate;

export default {
    templates,
    commands: {"contextMenuCellRule": contextMenuCellRuleCammand},
    contextMenu: ["contextMenuCellRule"]
}