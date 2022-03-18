<template>
  <div class="list">
     
     <el-row type="flex"  class="toolbar" justify="space-between">
      <el-col :span="12">
        <el-button-group>
            <el-button type="primary" @click="newTask()">新建任务</el-button>
        </el-button-group>
        <el-button-group>
        </el-button-group>
      
      </el-col>
      <el-col :span="12">
        <el-button-group style="float:right">
            <el-button type="primary" @click="designTemplate('task')">委托单模板</el-button>
            <el-button type="primary" @click="designTemplate('record')">填报单模板</el-button>
            <el-button type="primary" @click="designTemplate('report')">报告单模板</el-button>
        </el-button-group>
      </el-col>
      </el-row>

  <el-table ref="singleTable" :data="data" border 
    highlight-current-row stripe 
    style="width: 100%"
    @current-change="handleCurrentChange">
    <el-table-column prop="TaskNumber" label="委托编号" width="180"></el-table-column>
    <el-table-column prop="TestCompany" label="检测单位" width="180"></el-table-column>
    <el-table-column prop="TestName" label="实验名称"></el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="updateTask(scope.row.ID)">填写委托单</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="scope.row.TaskRecordID == null"
          @click="updateTask(scope.row.ID, 'record')">实验填报</el-button>
        <el-button
          size="mini"
          type="info"
          :disabled="scope.row.RecordRecordID == null"
          @click="lookReport(scope.row.ID)">查看报告</el-button>
      </template>
    </el-table-column>
  </el-table>
        


  <el-dialog
  title="创建委托单"
  :visible.sync="dialogVisible"
  width="50%">
  <el-form :model="newTaskData">
    <el-form-item label="检测单位" label-width="120px">
      <el-select v-model="newTaskData.testCompany" placeholder="请选择检测单位">
        <el-option label="西安葡萄城第一检测公司" value="西安葡萄城第一检测公司"></el-option>
        <el-option label="西安葡萄城第二检测公司" value="西安葡萄城第二检测公司"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="实验名称" label-width="120px">
      <el-select v-model="newTaskData.testName" placeholder="请选择实验名称">
        <el-option label="抗压强度实验" value="抗压强度实验"></el-option>
        <el-option label="室外实验" value="室外实验"></el-option>
      </el-select>
    </el-form-item>

    <!-- <el-form-item label="活动名称" label-width="120px">
      <el-input v-model="newTaskData.name" autocomplete="off"></el-input>
    </el-form-item> -->
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveTask()">确 定</el-button>
  </span>
</el-dialog>


  </div>


</template>

<script>
// @ is an alias to /src

import HttpUtils from '../../utils/httpUtils'
import { Notification } from 'element-ui';

export default {
  name: 'List',
  components: {
  },
  data: function() {
        return {
            dialogVisible: false,
            data: [],
            currentItem: null,
            newTaskData:{}
        };
    },
    created: async function() {
         let templateList = await HttpUtils.get("task/list");
         if(templateList){
         this.data = templateList;
        if(this.data.length){
            this.$refs.singleTable.setCurrentRow(this.data[0]);
        }
         }
    },
    methods: {
        handleCurrentChange: function(item) {
            this.currentItem = item;
        },

        designTemplate(type){
            this.$router.push({ 
                path:'/design',
                query:{
                    path: 'task',
                    schema: type,
                    type: type
                }
            })
        },

        newTask(){
            this.newTaskData = {}
            this.dialogVisible = true;
        },
        async saveTask(){

            if(!this.newTaskData.testCompany){
                Notification({title: '错误',message: "请选择检测单位",type:'error'});
                return;
            }
            if(!this.newTaskData.testName){
                Notification({title: '错误',message: "请选择委托项目",type:'error'});
                return;
            }
            var formData = new FormData();
            
            formData.append("testCompany", this.newTaskData.testCompany);
            formData.append("testName", this.newTaskData.testName);

            let result = await HttpUtils.post("task/new", formData);
            if(result){
                this.dialogVisible = false;
                Notification({title: '成功',message: "保存成功",type:'success'});
                let newData = {
                        ID: result,
                        TaskNumber: "WTD" + result,
                        TestName: this.newTaskData.testName,
                        TestCompany: this.newTaskData.testCompany
                    };
                this.data.push(newData);
                this.$refs.singleTable.setCurrentRow(newData);
            }
        },
        updateTask(id, type){
            this.$router.push({ 
                path:'/task/new',
                query:{
                    id: id,
                    type: type,
                    rule: "user"
                }
            })
        },
        lookReport(id, type){
            this.$router.push({ 
                path:'/task/report',
                query:{
                    id: id,
                }
            })
        }
    }
}
</script>
<style scoped>
.list{
    text-align: left;
}
</style>