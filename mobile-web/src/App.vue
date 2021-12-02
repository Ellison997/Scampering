<template>
  <div id="app">
    <!-- 
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
     -->
    <transition mode="out-in" name="v">
      <router-view />
    </transition>
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    // HelloWorld,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.v-enter {
  opacity: 0;
  transform: translateY(100%);
}
.v-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.v-enter-active {
  transition: 1s;
}
.v-leave {
  transform: translateY(0);
}
.v-leave-to {
  transform: translateY(-100%);
}
.v-leave-active {
  transition: 1s;
}
</style>
