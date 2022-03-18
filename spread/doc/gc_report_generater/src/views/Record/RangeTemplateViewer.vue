<template>
  <div class="designer">
     <el-row class="toolbar">
      <el-col :span="3"><el-input v-model="name" placeholder="请输入记录名称"></el-input></el-col>
      <el-col :span="18">
        <el-button-group>
      <el-button type="primary" @click="saveRecord()">保存</el-button>
      </el-button-group>
        <el-button-group>
      <el-button @click="lookReport()">预览报表</el-button>
      <el-button @click="goRcordList()">填报记录</el-button>
      </el-button-group>

      <el-button-group>
        <input type="file" ref="imageFile" :disabled = "disableInsertImage"/>
      <el-button @click="insertImage()" :disabled = "disableInsertImage">插入图片</el-button>

      </el-button-group>
      </el-col>
      </el-row>
      <div>
        <div style="width:88%; float:left">
          <gc-spread-sheets
            :hostStyle="hostStyle"
            @workbookInitialized="workbookInitialized"
          ></gc-spread-sheets>
        </div>
        <!-- <div style="width:28%; float:left">
          <embed type="" :src="pdfSource" v-if="pdfSource" style="margin-left:10px" width="100%" height="580px">
        </div> -->
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
import { processCellImage, addCellImage, processLock, processTable } from '../../components/SpreadSheets/common'

export default {
  name: 'RangeTemplateViewer',
  components: {
  },
  data:function(){
      return {
        spread: null,
        hostStyle: { height: "580px", width: "100%", border: "solid gray 1px" },
        name: "",
        id:"",
        templateId: "",
        pdfSource:'',
        rule:"",
        disableInsertImage: true
      }
  },
  methods: {

    processTableDefaultData(json, data){
        // 为数据源添加默认数组项
        if(json.designerBindingPathSchema && json.designerBindingPathSchema.properties){
            let properties = json.designerBindingPathSchema.properties
            for(var pro in properties){
                let filed = properties[pro];
                if(filed && filed.dataFieldType == "table"){
                    for(var dp in data){
                        let record = data[dp];
                        if(!record[pro]){
                            record[pro] = [{},{},{}];
                        }
                    }
                }
            }
        }
    },processRangeTemplate(spread, templateSheet, sheet, data){
        let rangeRowCount = templateSheet.getRowCount(),
            rangeColumnCount = templateSheet.getColumnCount();
        let startRow = 0;
        var fromRanges = [new GC.Spread.Sheets.Range(0, 0, rangeRowCount, rangeColumnCount)];
        for(let pro in data){
            sheet.setRowCount(startRow + rangeRowCount);
            var toRanges = [new GC.Spread.Sheets.Range(startRow, 0, rangeRowCount, rangeColumnCount)];
            spread.commandManager().execute({
                cmd: "clipboardPaste", 
                sheetName: sheet.name(), 
                fromSheet: templateSheet, 
                fromRanges: fromRanges, 
                pastedRanges: toRanges, 
                isCutting: false, 
                clipboardText: "", 
                pasteOption: GC.Spread.Sheets.ClipboardPasteOptions.all
            });

            for(var row = startRow; row < startRow + rangeRowCount; row++){
                sheet.setRowHeight(row, templateSheet.getRowHeight(row - startRow));
                for(var col = 0; col < rangeColumnCount; col++){
                    if(row == startRow){
                        sheet.setColumnWidth(col, templateSheet.getColumnWidth(col));
                    }
                    let bindingPath = sheet.getBindingPath(row, col);
                    if(bindingPath){
                        sheet.setBindingPath(row, col, pro + "." + bindingPath);
                    }
                }
            }
            for(var tp in templateSheet.tables.all()){
                let tempTable = templateSheet.tables.all()[tp];
                if(tempTable.bindingPath()){
                    let range = tempTable.range();
                    let table = sheet.tables.find(range.row + startRow, range.col);
                    table.bindingPath(pro + "." + table.bindingPath())
                }
            }

            startRow +=rangeRowCount;
        }       
        sheet.setActiveCell(0, 0)         
    
    },
    async workbookInitialized(value) {
      let self = this;
      this.spread = value;
        if(this.templateId){
            let template = await HttpUtils.get("template/get?id=" + this.templateId);
            let json = JSON.parse(Gzip.ungzipString(template.Content))
            this.spread.suspendPaint();
            this.spread.fromJSON(json);
            let data;

            if(this.id){
              let record = await HttpUtils.get("record/get?id=" + this.id);
              this.name = record.Name;
              data = JSON.parse(Gzip.ungzipString(record.Content));
            }
            
            if(!data){
                data = {
                    "record1": {"记录编号":(new Date()).getTime().toString()},
                    "record2": {"记录编号":(new Date()).getTime().toString()}
                }
            }
            this.processTableDefaultData(json, data);
            let templateSheet = this.spread.getActiveSheet();
            this.spread.addSheet(0);
            let sheet = this.spread.getSheet(0);
            this.spread.setActiveSheetIndex(0)

            this.processRangeTemplate(this.spread, templateSheet, sheet, data);
            console.log(sheet.toJSON(), data)
            let dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource(data);
            sheet.setDataSource(dataSource);
            sheet.options.isProtected = true;
            sheet.options.protectionOptions.allowInsertRows = true;
            // sheet.options.rowHeaderVisible = false;
            // sheet.options.colHeaderVisible = false;
            
            this.spread.options.scrollbarMaxAlign = true;
            this.spread.options.scrollbarShowMax = true;
            // this.spread.options.tabStripVisible = false;
            // disable the vertical scrollbar
            this.spread.options.showVerticalScrollbar = false;
            // disable the horizontal scrollbar
            this.spread.options.showHorizontalScrollbar = false;
            processCellImage(sheet)
            processLock(sheet, this.rule)
            processTable(sheet, false, data);
            // this.lookReport();
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
        }

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
    async saveRecord(){
        if(!this.name){
            alert("请输入模板名称");
            return;
        }
        var formData = new FormData();
        if(this.id){
            formData.append("id", this.id);
        }
        
        formData.append("templateId", this.templateId);
        formData.append("name", this.name);

        let sheet = this.spread.getActiveSheet();
        let recordData = sheet.getDataSource().getSource();
        formData.append("recordJSON", Gzip.gzipString(JSON.stringify(recordData)));
        formData.append("fullRecordJSON", Gzip.gzipString(JSON.stringify(this.spread.toJSON({includeBindingSource: true}))));

        let result = await HttpUtils.post("record/update", formData);
        if(result){
          this.id = result;
            Notification({title: '成功',message: "保存成功",type:'success'});
        }
     
    },
    goRcordList(){
        this.$router.push({ 
            path:'/record/list',
            query:{
                templateId: this.templateId
            }
        })
    },
    async lookReport(){
      var spreadJSON = JSON.stringify(this.spread.toJSON({ includeBindingSource: true }));
      var uploadData = Gzip.gzipString(spreadJSON);
        var formData = new FormData();
        formData.append("data", uploadData);

        let blob = await HttpUtils.post("report/getpdf", formData, {responseType: "blob"});
        const url = window.URL.createObjectURL(blob);
        // window.open(url, "_blank")
        this.pdfSource = url;
    },
  },
  created:function(){
      this.id = this.$route.query.id;
      this.templateId = this.$route.query.templateId;
      this.rule = this.$route.query.rule;
  },
}
</script>
<style scoped>
.designer{
    text-align: left;
}
</style>