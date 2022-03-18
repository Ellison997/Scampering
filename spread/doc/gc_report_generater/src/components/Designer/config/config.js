import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-designer-resources-cn";
import "@grapecity/spread-sheets-designer";

import LayoutConfig from "./layout/config"
import FontIconConfig from "./insert/fontIcon"
import CellRuleConfig from "./cellRule/config"
import TableConfig from "./table/config"

import { addFont } from "./font/addFont"

let config = JSON.parse(JSON.stringify(GC.Spread.Sheets.Designer.DefaultConfig));

config.commandMap = {};
config.ribbon.push(LayoutConfig.ribbon)
Object.assign(config.commandMap, LayoutConfig.commands, FontIconConfig.commands);
Object.assign(config.commandMap, CellRuleConfig.commands);
Object.assign(config.commandMap, TableConfig.commands);

config.contextMenu.push.apply(config.contextMenu, CellRuleConfig.contextMenu);

for(var name in CellRuleConfig.templates){
    GC.Spread.Sheets.Designer.registerTemplate(name, CellRuleConfig.templates[name]);
}

// 插入tab添加插入特殊字符
var fontIconConfig = {
    "label": "字符",
    "thumbnailClass": "ribbon-thumbnail-shapes",
    commandGroup:{
                "commands": [
                    "setFontIcon",
                ]
            }
};
config.ribbon[1].buttonGroups.splice(config.ribbon[1].buttonGroups.length - 1,0 , fontIconConfig)

//表格绑定，行拓展方式设置
var tableBandConfig = {
    "label": "绑定",
    "thumbnailClass": "ribbon-thumbnail-shapes",
    commandGroup:{
        "commands": [
            "tableExpandBoundRows",
        ]}
};
config.ribbon[6].buttonGroups.push(tableBandConfig);

//添加更多字体
addFont(config);

export default config;