import * as GC from "@grapecity/spread-sheets";

var ribbonLayoutCommands = {
    "showHidePrintLine": {
        text: "打印分页预览线",
        type: "checkbox",
        commandName: "showHidePrintLine",
        execute: async (context) => {
            let sheet = context.Spread.getActiveSheet();
            var isVisible = sheet.isPrintLineVisible();
            sheet.isPrintLineVisible(!isVisible);

        },
        getState: (context) => {
            let sheet = context.Spread.getActiveSheet();
            return sheet.isPrintLineVisible();
        }
    },
    "insertPageBreak": {
        iconClass: "ribbon-button-namemanager",
        text: "插入分页符",
        commandName: "insertPageBreak",
        execute: async (context) => {
            let sheet = context.Spread.getActiveSheet();
            sheet.setColumnPageBreak(sheet.getActiveColumnIndex(), true)
            sheet.setRowPageBreak(sheet.getActiveRowIndex(), true)
        }
    },
    "removeMargin": {
        iconClass: "ribbon-button-namemanager",
        text: "无页边距",
        bigButton: true,
        commandName: "removeMargin",
        execute: async (context) => {
            let sheet = context.Spread.getActiveSheet();
            var printInfo = sheet.printInfo();
            printInfo.margin({top:0, bottom:0, left:0, right:0, header:0, footer:0});
            sheet.printInfo(printInfo)
        }
    },
    "deletePageBreak": {
        iconClass: "ribbon-button-namemanager",
        text: "删除分页符",
        commandName: "deletePageBreak",
        execute: async (context) => {
            let sheet = context.Spread.getActiveSheet();
            sheet.setColumnPageBreak(sheet.getActiveColumnIndex(), false)
            sheet.setRowPageBreak(sheet.getActiveRowIndex(), false)
        }
    },
    "deleteAllPageBreak": {
        iconClass: "ribbon-button-namemanager",
        text: "删除所有分页符",
        commandName: "deleteAllPageBreak",
        execute: async (context) => {
            let sheet = context.Spread.getActiveSheet();
            sheet.suspendPaint()
            for (var row = 0; row < sheet.getRowCount(); row++) {
                sheet.setRowPageBreak(row, false)
            }
            for (var col = 0; col < sheet.getColumnCount(); col++) {
                sheet.setColumnPageBreak(col, false)
            }
            sheet.resumePaint();
        }
    },
    "setFitPagesWide": {
        text: "自动",
        type: "comboBox",
        commandName: "setFitPagesWide",
        dropdownList: [
            {
                text: "自动",
                value: "-1"
            },
            {
                text: "1",
                value: "1"
            },
            {
                text: "2",
                value: "2"
            }
        ],
        execute: async (context, selectValue) => {
            if (selectValue != null && selectValue != undefined) {
                    let sheet = context.Spread.getActiveSheet();
                    var printInfo = sheet.printInfo();
                    printInfo.fitPagesWide(parseInt(selectValue));
                    sheet.printInfo(printInfo)
            }
        },
        getState: (context) => {
            let sheet = context.Spread.getActiveSheet();
            var printInfo = sheet.printInfo()
            var value = printInfo.fitPagesWide();
            return value.toString();
        }

    },
    "setFitPagesTall": {
        text: "高度",
        type: "comboBox",
        commandName: "setFitPagesTall",
        dropdownList: [
            {
                text: "自动",
                value: "-1"
            },
            {
                text: "1",
                value: "1"
            },
            {
                text: "2",
                value: "2"
            }
        ],
        execute: async (context, selectValue) => {
            if (selectValue != null && selectValue != undefined) {
                    let sheet = context.Spread.getActiveSheet();
                    var printInfo = sheet.printInfo();
                    printInfo.fitPagesTall(parseInt(selectValue));
                    printInfo.centering(GC.Spread.Sheets.Print.PrintCentering.horizontal);
                    sheet.printInfo(printInfo)
            }
        },
        getState: (context) => {
            let sheet = context.Spread.getActiveSheet();
            var printInfo = sheet.printInfo()
            var value = printInfo.fitPagesTall();
            return value.toString();
        }
    },
    "setPageOrientation": {
        text: "高度",
        type: "comboBox",
        commandName: "setPageOrientation",
        dropdownList: [
            {
                text: "纵向",
                value: "portrait"
            },
            {
                text: "横向",
                value: "landscape"
            }
        ],
        execute: async (context, selectValue) => {
            if (selectValue != null && selectValue != undefined) {
                    let sheet = context.Spread.getActiveSheet();
                    var printInfo = sheet.printInfo();
                    printInfo.orientation(GC.Spread.Sheets.Print.PrintPageOrientation[selectValue]);
                    sheet.printInfo(printInfo)
            }
        },
        getState: (context) => {
            let sheet = context.Spread.getActiveSheet();
            var printInfo = sheet.printInfo()
            var value = printInfo.orientation();
            return GC.Spread.Sheets.Print.PrintPageOrientation[value];
        }
    }
}

var ribbonLayoutConfig = {
    "label": "页面布局",
    "thumbnailClass": "ribbon-thumbnail-spreadsettings",
    "commandGroup": {
        "children": [
            {
                "direction": "vertical",
                "commands": ["showHidePrintLine"]
            },
            {
                "type": "separator"
            },
            {
                "direction": "vertical",
                "commands":["removeMargin"]
            },
            {
                "type": "separator"
            },
            {
                "direction": "vertical",
                "commands": [
                    "insertPageBreak",
                    "deletePageBreak",
                    "deleteAllPageBreak"
                ]
            },
            {
                "type": "separator"
            },
            {
                "direction": "vertical",
                "commands": [
                    {
                        iconClass: "ribbon-button-namemanager",
                        text: "宽度",
                    },
                    {
                        iconClass: "ribbon-button-namemanager",
                        text: "高度",
                    }
                ]
            },
            {
                "direction": "vertical",
                "commands": [
                    "setFitPagesWide",
                    "setFitPagesTall"
                ]
            },
            {
                "type": "separator"
            },
            {
                "commands": [{
                    iconClass: "ribbon-button-namemanager",
                    text: "纸张方向",
                }]
            },
            {
                "commands": [
                    "setPageOrientation"
                ]
            }
            
        ]
    }
};


var layoutRibbon = {
    "id": "layout",
    "text": "页面布局",
    "buttonGroups": [
        ribbonLayoutConfig
    ]
}
var layoutToolBarRibbon = {
    "id": "layout",
    "text": "页面布局",
    overflow: true,
    "buttonGroups": [
        {
            commandGroup:{
                commands:["showHidePrintLine"]
            }
        },
        {
            commandGroup:{
                commands:["removeMargin"]
            }
        },
        {
            commandGroup:{
                commands:["insertPageBreak", "deletePageBreak", "deleteAllPageBreak"]
            }
        },
        {
            commandGroup:{
                commands:[{text:"宽度："},"setFitPagesWide", {text:"高度："}, "setFitPagesTall"]
            }
        },
        {
            commandGroup:{
                commands:[{text:"纸张方向："},"setPageOrientation"]
            }
        }
    ]
}


export default {
    ribbon: layoutRibbon,
    toolBarRibbon: layoutToolBarRibbon,
    commands: ribbonLayoutCommands
}
