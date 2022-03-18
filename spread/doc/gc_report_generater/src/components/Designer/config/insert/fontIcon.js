import * as GC from '@grapecity/spread-sheets'

var fontIconCammands = {
    "setFontIcon": {
        text: "字符",
        title: "插入字符",
        type: "dropdown",
        bigButton: "=ribbonHeight>toolbarHeight",
        iconClass: "ribbon-button-fontIcon",
        commandName: "setFontIcon",
        direction: "=IF(ribbonHeight<toolbarHeight,\"horizontal\",\"vertical\")",
        dropdownList: [
            {   
                groupName: "Batman",
                groupItems:[{
                    iconClass: "fontIcon-Batman fontIcon-Batman-E900",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E900",16)),
                    value: "Dexter Batman-" + String.fromCharCode(parseInt("E900",16))
                },{
                    iconClass: "fontIcon-Batman fontIcon-Batman-E901",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E901",16)),
                    value: "Dexter Batman-" + String.fromCharCode(parseInt("E901",16))
                },{
                    iconClass: "fontIcon-Batman fontIcon-Batman-E902",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E902",16)),
                    value: "Dexter Batman-" + String.fromCharCode(parseInt("E902",16))
                },{
                    iconClass: "fontIcon-Batman fontIcon-Batman-E903",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E903",16)),
                    value: "Dexter Batman-" + String.fromCharCode(parseInt("E903",16))
                }]
            },
            {   
                groupName: "钢筋",
                groupItems:[{
                    iconClass: "fontIcon-SJQY fontIcon-SJQY-0041",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("0041",16)),
                    value: "SJQY-" + String.fromCharCode(parseInt("0041",16))
                },{
                    iconClass: "fontIcon-SJQY fontIcon-SJQY-0042",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("0042",16)),
                    value: "SJQY-" + String.fromCharCode(parseInt("0042",16))
                },{
                    iconClass: "fontIcon-SJQY fontIcon-SJQY-0043",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("0043",16)),
                    value: "SJQY-" + String.fromCharCode(parseInt("0043",16))
                },{
                    iconClass: "fontIcon-SJQY fontIcon-SJQY-0044",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("0044",16)),
                    value: "SJQY-" + String.fromCharCode(parseInt("0044",16))
                },{
                    iconClass: "fontIcon-SJQY fontIcon-SJQY-0045",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("0045",16)),
                    value: "SJQY-" + String.fromCharCode(parseInt("0045",16))
                }]
            },
            {   
                groupName: "特殊",
                groupItems:[{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E900",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E900",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E900",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E901",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E901",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E901",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E902",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E902",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E902",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E903",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E903",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E903",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E904",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E904",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E904",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E905",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E905",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E905",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E906",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E906",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E906",16))
                },{
                    iconClass: "fontIcon-icomoon fontIcon-icomoon-E907",
                    iconHeight:32,
                    iconWidth:32,
                    tip: String.fromCharCode(parseInt("E907",16)),
                    value: "icomoon-" + String.fromCharCode(parseInt("E907",16))
                }]
            },
        ],
        execute: async (context, selectValue) => {
            if (selectValue != null && selectValue != undefined) {
                let newFont = selectValue.split("-")[0],
                    content = selectValue.split("-")[1];
                let sheet = context.Spread.getActiveSheet(),
                    row = sheet.getActiveRowIndex(),
                    col = sheet.getActiveColumnIndex(),
                    cell = sheet.getCell(row, col),
                    font = cell.font();
                var span = document.createElement("span");
                span.style.font = font;
                span.style.fontFamily = newFont;
                var iconFont = span.style.font;

                let value = sheet.getValue(row, col, GC.Spread.Sheets.SheetArea.viewport, GC.Spread.Sheets.ValueType.richText);
                if(value === null || value === undefined){
                    value = {richText:[{style:{font:iconFont},text: content}]};
                }
                else if(value instanceof Object && value.richText){
                    let rt = value.richText;
                    if(rt.length > 1 && rt[rt.length - 1].style){
                        let exStyle = JSON.parse(JSON.stringify(rt[rt.length - 1].style));
                        if(rt[rt.length - 1].style.font){
                            var span = document.createElement("span");
                            span.style.font = rt[rt.length - 1].style.font;
                            span.style.fontFamily = newFont;
                            exStyle.font = span.style.font;
                        }
                        else{
                            exStyle.font = iconFont;
                        }
                        rt.push({style: exStyle,text: content});
                    }
                    else{
                        rt.push({style:{font:iconFont},text: content});
                    }
                }
                else{
                    value = {richText:[
                        {style:{font:font}, text: value},
                        {style:{font:iconFont},text: content}]};
                }

                context.Spread.commandManager().execute({cmd: "editCell", sheetName: sheet.name(), row: row, col: col, newValue: value});
            }
        },
        getState: (context) => {
            return "";
        }

    }
}


export default {
    commands: fontIconCammands
}