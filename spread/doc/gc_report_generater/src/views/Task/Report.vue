<template>
  <div class="designer">
     <el-row class="toolbar">
      <el-col :span="6">
        <el-button-group>
      <el-button @click="goRcordList()">返回列表</el-button>
      </el-button-group>
        <el-button-group>
      <el-button type="success" @click="viewFullReport()">完整报告</el-button>
      </el-button-group>
      </el-col>
      </el-row>
     <el-row>
      <el-col :span="12">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="检测报告" name="reportSpread">
                <gc-spread-sheets
                  :hostStyle="hostStyle"
                  @workbookInitialized="reportworkbookInitialized"
                ></gc-spread-sheets>
          </el-tab-pane>
          <el-tab-pane label="检测记录" name="recordSpread">
                <gc-spread-sheets
                  :hostStyle="hostStyle"
                  @workbookInitialized="recordworkbookInitialized"
                ></gc-spread-sheets></el-tab-pane>
          <el-tab-pane label="委托单" name="taskSpread">
                <gc-spread-sheets
                  :hostStyle="hostStyle"
                  @workbookInitialized="taskworkbookInitialized"
                ></gc-spread-sheets></el-tab-pane>
        </el-tabs>
      </el-col>

      <el-col :span="12">
          <embed type="" :src="pdfSource" v-if="pdfSource" style="margin-left:10px" width="100%" height="580px">
      </el-col>
      </el-row>

      <div>
        <div style="width:98%;  ">
        </div>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src

import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-resources-zh";
import "@grapecity/spread-sheets-vue";
import "@grapecity/spread-sheets-print"
import "@grapecity/spread-sheets-barcode"

GC.Spread.Common.CultureManager.culture("zh-cn");
import HttpUtils from '../../utils/httpUtils'
import Gzip from '../../utils/gzip'
import { Notification } from 'element-ui';
import { processCellImage, setViewMode, processTable, processLock } from '../../components/SpreadSheets/common'

export default {
  name: 'Report',
  components: {
  },
  data:function(){
      return {
        reportSpread: null,
        recordSpread: null,
        taskSpread: null,
        hostStyle: { height: "550px", width: "100%" },
        id:this.$route.query.id,
        type: 'report',
        activeTab: "reportSpread",
        pdfSource: null
      }
  },
  methods: {
    async reportworkbookInitialized(value) {
      this.reportSpread = value;
      if(!this.id){
        return;
      }
      setViewMode(this.reportSpread)

      let task = await HttpUtils.get("task/getTask?id=" + this.id + "&type=" + this.type);
      
      task.TaskTemplateContent = JSON.parse(Gzip.ungzipString(task.TaskTemplateContent))
      task.RecordTemplateContent = JSON.parse(Gzip.ungzipString(task.RecordTemplateContent))
      task.ReportTemplateContent = JSON.parse(Gzip.ungzipString(task.ReportTemplateContent))

      task.TaskContent = JSON.parse(Gzip.ungzipString(task.TaskContent));
      let recordJSON = JSON.parse(Gzip.ungzipString(task.RecordContent));
      task.ReportContent = JSON.parse(Gzip.ungzipString(task.RecordContent));
      task.ReportContent["报告单名称"] = task.TestName + "检测报告";
      task.RecordContent = recordJSON;
          
      this.initWorkbook(this.reportSpread, task.ReportTemplateContent, task.ReportContent);
      this.initWorkbook(this.recordSpread, task.RecordTemplateContent, task.RecordContent);
      this.initWorkbook(this.taskSpread, task.TaskTemplateContent, task.TaskContent);
      this.lookReport(this.reportSpread)
    },

    async recordworkbookInitialized(value) {
      this.recordSpread = value;
    },
    async taskworkbookInitialized(value) {
      this.taskSpread = value;
    },
    initWorkbook(spread, json, data){
      spread.suspendPaint();
      spread.fromJSON(json);
      setViewMode(spread)
      let sheet = spread.getActiveSheet();
      sheet.options.isProtected = true;
      processTable(sheet, true, data);
      let dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
      sheet.setDataSource(dataSource);
      processCellImage(sheet)
      spread.resumePaint();
    },
    goRcordList(){
        this.$router.push({ 
            path:'/task/list',
        })
    },
      handleClick(tab, event) {
        let spread = this[this.activeTab];
        spread.getHost().style.display = "none"
        setTimeout(function(){
          spread.refresh();
        spread.getHost().style.display = "block"
        },10)
        this.lookReport(spread);
      },
    async lookReport(spread){
      var spreadJSON = JSON.stringify(spread.toJSON({ includeBindingSource: true }));
      var uploadData = Gzip.gzipString(spreadJSON);
        var formData = new FormData();
        formData.append("data", uploadData);

        let blob = await HttpUtils.post("report/getpdf", formData, {responseType: "blob"});
        const url = window.URL.createObjectURL(blob);
        // window.open(url, "_blank")
        this.pdfSource = url;
    },
    async viewFullReport(){
      var reportSpreadJSON = JSON.stringify(this.reportSpread.toJSON({ includeBindingSource: true }));
      var recordSpreadJSON = JSON.stringify(this.recordSpread.toJSON({ includeBindingSource: true }));
      var taskSpreadJSON = JSON.stringify(this.taskSpread.toJSON({ includeBindingSource: true }));
        var formData = new FormData();
        formData.append("content1", Gzip.gzipString(reportSpreadJSON));
        formData.append("content2", Gzip.gzipString(recordSpreadJSON));
        formData.append("content3", Gzip.gzipString(taskSpreadJSON));

        let blob = await HttpUtils.post("report/getfullpdf", formData, {responseType: "blob"});
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank")

    }
   
  },
  created:function(){
  },
}
</script>
<style scoped>
.designer{
    text-align: left;
}
</style>