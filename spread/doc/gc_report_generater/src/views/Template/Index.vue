<template>
  <div class="template">
    <el-row>
  <i class="el-icon-arrow-left goback" @click="$router.go(-1)"></i>
      模板管理
      </el-row>
      <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Index',
  components: {
  }
}
</script>
<style scoped>
.template{
  text-align: left;
}
</style>
