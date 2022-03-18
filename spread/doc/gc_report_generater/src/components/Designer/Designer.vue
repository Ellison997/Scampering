<template>
  <div class="designer">
    <div class="panelSwitch">
      <el-switch
        v-model="toolBarMode"
        active-text="ToolBar"
        inactive-text=""
        @change="toolBarModeChanged">
      </el-switch>
    </div>
    <gc-spread-sheets-designer
      :styleInfo="styleInfo"
      :config="config"
      @designerInitialized="designerInitialized"
    ></gc-spread-sheets-designer>
  </div>
</template>

<script>
// @ is an alias to /src

import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import * as GC from "@grapecity/spread-sheets";
import * as ExcelIO from "@grapecity/spread-excelio"
import "@grapecity/spread-sheets-shapes"
import "@grapecity/spread-sheets-pivot-addon"
import "@grapecity/spread-sheets-resources-zh";
import "@grapecity/spread-sheets-designer-resources-cn";

// GC.Spread.Sheets.DesignerRes.res.ribbon.fontFamilies["ff23"] = {name: "微软雅黑", text: "微软雅黑"}
// GC.Spread.Sheets.DesignerRes.res.ribbon.fontFamilies["ff24"] = {name: "SJQY", text: "SJQY"}
// GC.Spread.Sheets.DesignerRes.res.ribbon.fontFamilies["ff25"] = {name: "icomoon", text: "icomoon"}
// GC.Spread.Sheets.DesignerRes.res.ribbon.fontFamilies["ff26"] = {name: "Dexter Batman", text: "Dexter Batman"}
import "@grapecity/spread-sheets-designer";
import "@grapecity/spread-sheets-designer-vue";
GC.Spread.Common.CultureManager.culture("zh-cn");
import defaultConfig from './config/config'
import toolBarModeConfig from './config/toolBarModeConfig'

window.GC = GC

// GC.Spread.Sheets.LicenseKey = ExcelIO.LicenseKey = "SpreadJS 授权";
// GC.Spread.Sheets.Designer.LicenseKey = "在线表格编辑器授权"

export default {
  name: 'Designer',
  components: {
  },
  data:function(){
      return {
        styleInfo: { height: "100%", width: "100%" },
        config: defaultConfig,
        designer: null,
        name: "",
        id:"",
        toolBarMode: false
      }
  },
  methods: {
    async designerInitialized(value) {
        this.designer = value;
        this.$emit("designerInitialized",value);
    },
    toolBarModeChanged(value){
      this.designer.setConfig(value? toolBarModeConfig: defaultConfig)
    }
  }
}
</script>
<style scoped>
.designer{
    text-align: left;
    width: 100%;
    height: 100%;
    position: relative;
}
.panelSwitch{
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 200;
    padding: 6px;
}
</style>