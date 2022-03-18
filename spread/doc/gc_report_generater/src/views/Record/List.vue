<template>
  <div class="list">
      
     <el-row class="toolbar">
      <el-col :span="24">
        <el-button-group>
        <el-button type="primary" @click="addRecord()">新建填报</el-button>
        <el-button type="primary" @click="updateRecord()">更新填报记录</el-button>
         </el-button-group>
        <el-button-group>
        <el-button @click="lookRecord()">查看填报数据</el-button>
        <el-button @click="lookReport()">预览报表</el-button>
        <el-button @click="lookAllRecord()">查看所有填报数据</el-button>
        <el-button @click="lookTotalRecord()">查看合计报表</el-button>
      </el-button-group>
    <el-button-group>
        <el-button type="primary" @click="addRangeRecord()">填报区域模板</el-button>
        <el-button type="primary" @click="updateRangeRecord()">更新区域模板</el-button>
    </el-button-group>

      </el-col>
      </el-row>
      

  <el-table ref="singleTable" :data="data" border 
    highlight-current-row stripe 
    style="width: 100%"
    @current-change="handleCurrentChange">
    <el-table-column prop="ID" label="ID" width="180"></el-table-column>
    <el-table-column prop="TemplateID" label="TemplateID" width="180"></el-table-column>
    <el-table-column prop="Name" label="Name" width="180"></el-table-column>
    <el-table-column prop="FileName" label="FileName"></el-table-column>
  </el-table>
        

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="40%">
            <span>
            <pre style="height:400px;overflow: scroll;" v-html="recordData" > </pre>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>


  </div>
</template>

<script>
// @ is an alias to /src


import HttpUtils from '../../utils/httpUtils'
import Gzip from '../../utils/gzip'

import {js as js_beautify} from 'js-beautify'


export default {
  name: 'List',
  components: {
  },
  data: function() {
        return {
            templateId: "",
            data: [],
            recordData: "",
            currentItem: null,
            dialogVisible: false
        };
    },
    created: async function() {
        this.templateId = this.$route.query.templateId;
        let templateList = await HttpUtils.get("record/list?templateId=" + this.templateId);
        this.data = templateList;
        if(this.data.length){
            this.$refs.singleTable.setCurrentRow(this.data[0]);
        }
    },
    mounted:function(){
    },
    methods: {
        handleCurrentChange: function(item) {
            this.currentItem = item;
        },

        addRecord(){
            this.$router.push({ 
                path:'/record/viewer',
                query:{
                    templateId: this.templateId || this.currentItem.TemplateID,
                    rule: "user"
                }
            })
        },
        updateRecord(){
            this.$router.push({ 
                path:'/record/viewer',
                query:{
                    id: this.currentItem.ID,
                    templateId: this.currentItem.TemplateID,
                    rule: "user"
                }
            })
        },
        async lookRecord(){
            let record = await HttpUtils.get("record/get?id=" + this.currentItem.ID);
            this.recordData = js_beautify(Gzip.ungzipString(record.Content));
            this.dialogVisible = true;
        },
        async lookAllRecord(){
            this.$router.push({ 
                path:'/record/allData',
                query:{
                    templateId: this.templateId
                }
            })
        },
        async lookTotalRecord(){
            this.$router.push({ 
                path:'/record/total',
                query:{
                    templateId: this.templateId
                }
            })
        },
        async lookReport(){

            let blob = await HttpUtils.get("report/bindPDF?recordId=" + this.currentItem.ID + "&templateId="+this.currentItem.TemplateID, {responseType: "blob"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank")
        },
        addRangeRecord(){
            this.$router.push({ 
                path:'/record/rangeTemplate',
                query:{
                    templateId: this.templateId || this.currentItem.TemplateID,
                    rule: 'user',
                }
            })
        },
        updateRangeRecord(){
            this.$router.push({ 
                path:'/record/rangeTemplate',
                query:{
                    id: this.currentItem.ID,
                    templateId: this.templateId || this.currentItem.TemplateID,
                    rule: 'user',
                }
            })
        },
    }
}
</script>
<style scoped>
.list{
    text-align: left;
}
</style>