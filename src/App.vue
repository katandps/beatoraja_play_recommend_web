<template>
  <div id="app">
    <pageHeader />
    <router-view/>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";
import Vue from 'vue'
import GAuth from "vue-google-oauth2/index";

export default {
  name: "App",
  components: {PageHeader},
  mounted() {
    let options = {
      clientId: process.env.VUE_APP_CLIENT_ID,
      scope: 'email profile openid',
      prompt: 'consent',
      fetch_basic_profile: false
    }
    Vue.use(GAuth, options)
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>