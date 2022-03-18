
import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-designer-resources-cn";
import "@grapecity/spread-sheets-designer";


export function addFont(config){

    // update font
    var fontFamilyCommand = GC.Spread.Sheets.Designer.getCommand(GC.Spread.Sheets.Designer.CommandNames.FontFamily);
    fontFamilyCommand.dropdownList.push({
        text: "微软雅黑",
        value: "微软雅黑"
    },
    {
        text: "宋体",
        value: "宋体"
    });
    config.commandMap[GC.Spread.Sheets.Designer.CommandNames.FontFamily] = fontFamilyCommand;
    var formatDialogTemplate = GC.Spread.Sheets.Designer.getTemplate(GC.Spread.Sheets.Designer.TemplateNames.FormatDialogTemplate)
    formatDialogTemplate.content[0].children[2].children[0].children[0].children[0].children[1].items.push({
        text: "微软雅黑", value: "微软雅黑"},
        {
            text: "宋体",
            value: "宋体"
        });
    GC.Spread.Sheets.Designer.registerTemplate(GC.Spread.Sheets.Designer.TemplateNames.FormatDialogTemplate, formatDialogTemplate)


    var resources = GC.Spread.Sheets.Designer.getResources();
    resources.ribbon.fontFamilies["ff23"] = {name: "微软雅黑", text: "微软雅黑"}
    resources.ribbon.fontFamilies["ff24"] = {name: "SJQY", text: "SJQY"}
    resources.ribbon.fontFamilies["ff25"] = {name: "icomoon", text: "icomoon"}
    resources.ribbon.fontFamilies["ff26"] = {name: "Dexter Batman", text: "Dexter Batman"}
    GC.Spread.Sheets.Designer.setResources(resources);

}