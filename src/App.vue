<template>
  <div id="app">
    <PageHeader @handleSignIn="handleSignIn" @handleSignOut="handleSignOut"/>
    <router-view/>
  </div>
</template>

<script>
import PageHeader from "./components/PageHeader";
import Vue from 'vue'
import GAuth from "vue-google-oauth2/index";
import Api from "./api";

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
  },
  watch: {
    // ルート切り替え検出
    '$route': async function (to, from) {
      if (to.path !== from.path) {
        if (this.$store.getters.token) {
          await Api.check_account(this.$store.getters.token).catch((e) => {
            console.log(e);
            this.handleSignOut();
          });
        }
      }
    }
  },
  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn()
        if (!googleUser) {
          return null
        }
        const response = googleUser.getAuthResponse();
        await Api.check_account(response.id_token);
        this.$store.commit('setUserInfo', response)
      } catch (error) {
        console.error(error)
      }
    },
    async handleSignOut() {
      try {
        await this.$gAuth.signOut()
        this.$store.commit('setUserInfo', {})
        window.location.href = '/beatoraja_play_recommend_web/'
      } catch (error) {
        console.error(error)
      }
    }
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