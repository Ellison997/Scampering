<template>
  <div class="designer">
     <el-row class="toolbar">
      <el-col :span="24">
        <el-button-group>
      <el-button type="primary" @click="saveTask()">保存</el-button>
      </el-button-group>

      <el-button-group>
        <input type="file" ref="imageFile" :disabled = "disableInsertImage"/>
      <el-button @click="insertImage()" :disabled = "disableInsertImage">插入图片</el-button>

      </el-button-group>

        <el-button-group>
      <el-button @click="lookReport()">预览报表</el-button>
      <el-button @click="goRcordList()">返回列表</el-button>
      </el-button-group>
      </el-col>
      </el-row>
      <div>
        <div style="width:98%;  ">
          <gc-spread-sheets
            :hostStyle="hostStyle"
            @workbookInitialized="workbookInitialized"
          ></gc-spread-sheets>
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

GC.Spread.Common.CultureManager.culture("zh-cn");
import HttpUtils from '../../utils/httpUtils'
import Gzip from '../../utils/gzip'
import { Notification } from 'element-ui';
import { processCellImage, processLock, setViewMode, processTable, addCellImage } from '../../components/SpreadSheets/common'

export default {
  name: 'New',
  components: {
  },
  data:function(){
      return {
        spread: null,
        hostStyle: { height: "580px", width: "1000px" },
        id:this.$route.query.id,
        rule:this.$route.query.rule,
        type:this.$route.query.type || 'task',
        disableInsertImage: true
      }
  },
  methods: {
    async workbookInitialized(value) {
      let self = this;
      this.spread = value;
      if(!this.id){
        return;
      }
            setViewMode(this.spread)
            this.spread.suspendPaint();

            let task = await HttpUtils.get("task/getTask?id=" + this.id + "&type=" + this.type);
            if(this.type === 'task' && task.TaskTemplateContent){
              let json = JSON.parse(Gzip.ungzipString(task.TaskTemplateContent))
              this.spread.fromJSON(json);
            }
            else if(this.type === 'record' && task.RecordTemplateContent){
              let json = JSON.parse(Gzip.ungzipString(task.RecordTemplateContent))
              this.spread.fromJSON(json);
            }
            setViewMode(this.spread)

            let data;
            if(this.type === "task"){
              if(task.TaskContent){
                data = JSON.parse(Gzip.ungzipString(task.TaskContent))
              }
              else{
                data = {
                  "检测单位": task.TestCompany,
                  "委托编号": task.TaskNumber,
                  "委托单名称": task.TestName + "委托单",
                }
              }
            }
            else if(this.type==="record"){
              if(task.RecordContent){
                data = JSON.parse(Gzip.ungzipString(task.RecordContent))
              }
              else if(task.TaskContent){
                data = JSON.parse(Gzip.ungzipString(task.TaskContent))
                data["检测单名称"] = task.TestName + "检测记录表";
                data["记录编号"] = "REC" + new Date().getTime();
                data["实验记录"] = [];
                for(var i = 0; i < data["检测次数"]; i++){
                  data["实验记录"].push({})
                }
              }
            }

            let sheet = this.spread.getActiveSheet();
            processTable(sheet, false, data)
            let dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
            sheet.setDataSource(dataSource);
            processCellImage(sheet)
            processLock(sheet, this.rule)
            this.spread.resumePaint();

            this.spread.bind(GC.Spread.Sheets.Events.EnterCell, (s, e)=>{
              let sheet = e.sheet, row = e.row, col = e.col;
              let tag = sheet.getTag(row, col);
              if(tag && tag["signature"]){
                self.disableInsertImage = false;
              }
              else{
                self.disableInsertImage = true;
              }
            })

    },
   
    async saveTask(){

        let sheet = this.spread.getActiveSheet();
        let recordData = sheet.getDataSource().getSource();

        var formData = new FormData();
        formData.append("id", this.id);
        formData.append("type", this.type);
        formData.append("content", Gzip.gzipString(JSON.stringify(recordData)));

        let result = await HttpUtils.post("task/saveTask", formData);
        if(result){
          Notification({title: '成功',message: "保存成功",type:'success'});
        }
     
    },
    goRcordList(){
        this.$router.push({ 
            path:'/task/list',
        })
    },
    async lookReport(){
      var spreadJSON = JSON.stringify(this.spread.toJSON({ includeBindingSource: true }));
      var uploadData = Gzip.gzipString(spreadJSON);
        var formData = new FormData();
        formData.append("data", uploadData);

        let blob = await HttpUtils.post("report/getpdf", formData, {responseType: "blob"});
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank")
    },
    async insertImage() {
      let file = this.$refs.imageFile.files[0]
      if(file){
        let imageUrl = URL.createObjectURL(file);
        let sheet = this.spread.getActiveSheet(), row = sheet.getActiveRowIndex(), col = sheet.getActiveColumnIndex();
        let imageName = "img-"+row+"-"+col;
        var pic = sheet.pictures.get(imageName);
        if(pic){
          sheet.pictures.remove(imageName)
        }
        let src = await addCellImage(sheet, row, col, imageUrl, imageName);
        sheet.setValue(row, col, src);
      }
    },
   
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