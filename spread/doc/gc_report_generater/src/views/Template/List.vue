<template>
  <div class="list">
     
     <el-row class="toolbar">
      <el-col :span="12">
        <el-button-group>
            <el-button type="primary" @click="designTemplate()">新建模板</el-button>
            <el-button type="primary" @click="updateTemplate()">编辑模板</el-button>
            <el-button type="primary" @click="lookReport()">预览模板</el-button>
        </el-button-group>
        <el-button-group>
            <el-button @click="addRecord()">填报</el-button>
            <el-button @click="goRcordList()">查看填报记录</el-button>
        </el-button-group>
      
      </el-col>
      </el-row>

  <el-table ref="singleTable" :data="data" border 
    highlight-current-row stripe 
    style="width: 100%"
    @current-change="handleCurrentChange">
    <el-table-column prop="ID" label="ID" width="180"></el-table-column>
    <el-table-column prop="Name" label="Name" width="180"></el-table-column>
    <el-table-column prop="FileName" label="FileName"></el-table-column>
  </el-table>
        

  </div>
</template>

<script>
// @ is an alias to /src

import HttpUtils from '../../utils/httpUtils'

export default {
  name: 'List',
  components: {
  },
  data: function() {
        return {
            data: [],
            currentItem: null
        };
    },
    created: async function() {
         let templateList = await HttpUtils.get("template/list");
         this.data = templateList;
        if(this.data.length){
            this.$refs.singleTable.setCurrentRow(this.data[0]);
        }
    },
    methods: {
        handleCurrentChange: function(item) {
            this.currentItem = item;
        },

        designTemplate(){
            this.$router.push({ 
                path:'/design',
                query:{
                    path: 'template',
                    schema: 'template'
                }
            })
        },
        updateTemplate(){
            this.$router.push({ 
                path:'/design',
                query:{
                    id: this.currentItem.ID,
                    path: 'template',
                    schema: 'template'
                }
            })
        },

        addRecord(){
            this.$router.push({ 
                path:'/record/viewer',
                query:{
                    templateId: this.currentItem.ID,
                    rule: "user"
                }
            })
        },
        goRcordList(){

            this.$router.push({ 
                path:'/record/list',
                query:{
                    templateId: this.currentItem.ID
                }
            })
        },
        async lookReport(){
            let blob = await HttpUtils.get("report/bindPDF?templateId=" + this.currentItem.ID, {responseType: "blob"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank")
        },
    }
}
</script>
<style scoped>
.list{
    text-align: left;
}
</style>