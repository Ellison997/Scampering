<template>
  <div class="designer">
     <el-row class="toolbar">
      <el-col :span="6">
        <el-button-group>
      <el-button @click="goRcordList()">填报记录</el-button>
      </el-button-group>
      </el-col>
      </el-row>
      <div>
          <gc-spread-sheets
            :hostStyle="hostStyle"
            @workbookInitialized="workbookInitialized"
          ></gc-spread-sheets>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src

import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import * as GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-resources-zh";
import "@grapecity/spread-sheets-vue";

GC.Spread.Common.CultureManager.culture("zh-cn");
import HttpUtils from '../../utils/httpUtils'

export default {
  name: 'AllData',
  components: {
  },
  data:function(){
      return {
        spread: null,
        hostStyle: { height: "580px", width: "100%", border: "solid gray 1px" },
        templateId: this.$route.query.templateId,
      }
  },
  methods: {
    async workbookInitialized(value) {
      this.spread = value;
        if(this.templateId){
          this.spread.suspendPaint();
            let record = await HttpUtils.get("record/getAll?templateId=" + this.templateId);
            let sheet = this.spread.getActiveSheet();
            sheet.setDataSource(record);
            this.spread.resumePaint();
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