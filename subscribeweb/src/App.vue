<template>
  <div id="app">
    <Subscribe msg="Welcome to Your Vue.js App"/>
    <!-- <Psq msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
import Subscribe from "./components/Subscribe.vue";
import Psq from "./components/Psq.vue";
export default {
  name: "app",
  components: {
    Subscribe,
    Psq
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  height: 100vh;
}
</style>
