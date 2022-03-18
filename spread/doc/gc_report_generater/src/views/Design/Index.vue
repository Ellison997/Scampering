<template>
  <div class="design">

     <el-row>
<el-col :span="3"><el-button @click="$router.go(-1)">返回</el-button>
  </el-col>
      <el-col :span="3">
        <el-input v-model="name" :disabled="id!==undefined" placeholder="请输入记录名称"></el-input>
        </el-col>
      <el-col :span="9">
        <el-button type="primary" @click="saveTemplate()">保存</el-button>
        <el-button @click="lookReport()">预览报表</el-button>
      </el-col>
      </el-row>
    <div style="height:650px;width:100%">
      <Designer
        @designerInitialized="designerInitialized"
      ></Designer>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Designer from '../../components/Designer/Designer'
import HttpUtils from '../../utils/httpUtils'
import Gzip from '../../utils/gzip'
import { Loading, Notification } from 'element-ui';

export default {
  name: 'Index',
  components: {
    Designer
  },
  data:function(){
      return {
        designer: null,
        name: "",
        id: this.$route.query.id,
        path: this.$route.query.path,
        schemaName: this.$route.query.schema,
        type: this.$route.query.type
      }
  },
  mounted: function(){
    Loading.service().close();
  },
  methods: {
    async designerInitialized(value) {
      this.designer = value;
      var spread = this.designer.getWorkbook();
        if(this.path){
          let template = await HttpUtils.get(this.path + "/get?id=" + this.id + "&type=" + this.type, {responseType: "json"});
          if(template){
            this.id = template.ID
            this.name = template.Name;
            if(template.Content){
              let json = JSON.parse(Gzip.ungzipString(template.Content))
              spread.fromJSON(json);

              if (json.designerBindingPathSchema) {
                  this.designer.setData("treeNodeFromJson", JSON.stringify(json.designerBindingPathSchema));
                  this.designer.setData("oldTreeNodeFromJson", JSON.stringify(json.designerBindingPathSchema));
              }
              else{
                this.setDefaultSchema()
              }
            }
          }
          else{
            this.setDefaultSchema()
          }
        }
    },
    async setDefaultSchema(){
      import("../../components/Designer/bingdingSchema/" + this.schemaName + ".json").then(defaultSchema => {
        this.designer.setData("treeNodeFromJson", JSON.stringify(defaultSchema));
        this.designer.setData("oldTreeNodeFromJson", JSON.stringify(defaultSchema));
      });
    },
    async saveTemplate(){
        if(!this.name){
            alert("请输入模板名称");
            return;
        }
        var formData = new FormData();
        if(this.id){
            formData.append("id", this.id);
        }
        formData.append("name", this.name);
        var spread = this.designer.getWorkbook();
        let json = spread.toJSON()
        let designerBindingPathSchema = this.designer.getData("updatedTreeNode") || this.designer.getData("oldTreeNodeFromJson");
        if(designerBindingPathSchema){
            json.designerBindingPathSchema = JSON.parse(designerBindingPathSchema);
        }
      
        formData.append("templateJSON", Gzip.gzipString(JSON.stringify(json)));

        let result = await HttpUtils.post(this.path + "/update", formData);
        if(result){
            this.id = result;
            Notification({title: '成功',message: "保存成功",type:'success'});
        }
    },
    async lookReport(){
        var spread = this.designer.getWorkbook()
      var spreadJSON = JSON.stringify(spread.toJSON({ includeBindingSource: true }));
      var uploadData = Gzip.gzipString(spreadJSON);
        var formData = new FormData();
        formData.append("data", uploadData);

        let blob = await HttpUtils.post("report/getpdf", formData, {responseType: "blob"});
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank")
    },
  },
  created:function(){
  },
}
</script>
<style scoped>
.design{
    text-align: left;
}
</style>