
<template>
  <div>
    <gc-spread-sheets-designer
      :styleInfo="styleInfo"
      :config="config"
      @designerInitialized="designerInitialized"
    >
    </gc-spread-sheets-designer>
  </div>
</template>
<script>
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets-resources-zh";
import GC from "@grapecity/spread-sheets";
GC.Spread.Common.CultureManager.culture("zh-cn"); // 设置语言为中文

import "@grapecity/spread-sheets-vue";
import "@grapecity/spread-sheets-shapes";
import "@grapecity/spread-sheets-pivot-addon";

import "@grapecity/spread-sheets-designer";
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import { Designer } from '@grapecity/spread-sheets-designer-vue';
import '@grapecity/spread-sheets-designer-resources-cn';

export default {
  data() {
    return {
      spread: null,
      styleInfo: {
        height: "100%",
      },
      config: GC.Spread.Sheets.Designer.DefaultConfig,
    };
  },
  computed: {
    dataTable() {
      let dataTable = [];
      for (let i = 0; i < 42; i++) {
        dataTable.push({ price: i + 0.56 });
      }
      return dataTable;
    },
  },
  methods: {
    onItemSelected(i) {
      console.log(i);
    },
    //  初始化方法
    designerInitialized(designer) {
      let that = this;
      this.designer = designer;
      let spread = this.designer.getWorkbook();
      let sheet = spread.getActiveSheet();
      sheet.setArray(0, 0, [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
      ]);
    },
  },

  mounted() {},
  created() {
    // let spread = this.spread;
    // spread.fromJSON(jsonStr, jsonOptions);
  },
};
</script>
<style scoped>
.spread-host {
  width: 100%;
  height: 600px;
}
</style>

                    