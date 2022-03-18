<template>
  <div class="home">
    <div><i class="el-icon-arrow-left goback" @click="$router.go(-1)"></i>
    模板填报</div>
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
