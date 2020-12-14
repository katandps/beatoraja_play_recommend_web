<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-1">
      <div class="navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item d-flex align-items-center">
            <router-link class="text-dark px-2" to="/">Home</router-link>
            <router-link class="text-dark px-2" to="view">Score</router-link>
          </li>
          <li class="nav-item d-flex align-items-center">
            <router-link v-if="Object.keys($store.state.userInfo).length" class="text-dark px-2" to="/upload">
              Upload
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a v-if="!Object.keys($store.state.userInfo).length" class="text-dark px-3" href="javascript:void(0);"
               @click.prevent="handleSignIn">Login</a>
            <a v-if="Object.keys($store.state.userInfo).length" class="text-dark px-3" href="javascript:void(0);"
               @click.prevent="handleSignOut">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
  methods: {
    async handleSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn()
        if (!googleUser) {
          return null
        }
        this.$store.commit('setUserInfo', googleUser.getAuthResponse())
      } catch (error) {
        console.error(error)
        return null
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

</style>