<template>
  <div id="app">

<el-container>
  <el-header>    

    <div>
      <h1 class="nav">检测云</h1>
      <el-menu  class="nav el-menu-header" mode="horizontal"
        background-color="#545c64" router
        text-color="#fff">
        <el-menu-item index="/"> Home</el-menu-item>
        <el-menu-item index="/task/list">任务列表</el-menu-item>
        <el-menu-item index="/template/list">模版列表</el-menu-item>
      </el-menu>
    </div>
    </el-header>
  <el-container>
    <!-- <el-aside :width="isCollapse?'65px':'201px'" style="transition:width 0.5s"> -->
    <el-aside width="unset">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo"
        @open="handleOpen" 
        @close="handleClose" 
        @select="handleSelect"
        :collapse="isCollapse">
        
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
        </el-menu-item>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main><router-view/></el-main>
  </el-container>
</el-container>


    
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: function(){
    return {
      isCollapse: true
    }
  },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key){
        if(key==="0"){
          this.isCollapse = !this.isCollapse;
          setTimeout(function(){
            window.dispatchEvent(new Event('resize'));
          },700)
        }
      }
    }
}
</script>


<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

/* #nav {
  padding: 30px;
} */

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

  html,body,#app,.el-container{
    height: 100%;
    margin: 0;
  }


  .el-header, .el-footer {
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /* text-align: center; */
    /* line-height: 200px; */
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    /* text-align: center; */
    /* line-height: 160px; */
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }

  .nav{
    float: left;
  }
  .el-header h1{
        min-width: 200px;
    color: white;
    margin: 0px;
  }
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }

.goback{
  cursor: pointer;
}
.el-button-group{
  margin-right: 10px;
}
.toolbar{
  margin: 10px 0;
}
</style>
