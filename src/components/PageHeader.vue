<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light p-1">
      <div class="navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item d-flex align-items-center">
            <router-link class="text-dark px-2" to="/">ホーム</router-link>
            <router-link class="text-dark px-2" to="view">スコア閲覧</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item d-flex">
            <router-link v-if="is_login" class="text-dark px-2" to="/my_score">マイスコア</router-link>
            <router-link v-if="is_login" class="text-dark px-2" to="/upload">スコアアップロード</router-link>
            <a v-if="!is_login" class="text-dark px-3" href="javascript:void(0);"
               @click.prevent="handleSignIn">ログイン</a>
            <a v-if="is_login" class="text-dark px-3" href="javascript:void(0);"
               @click.prevent="handleSignOut">ログアウト</a>
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
      this.$emit("handleSignIn");
    },
    async handleSignOut() {
      this.$emit("handleSignOut");
    }
  },
  computed: {
    is_login() {
      return !!Object.keys(this.$store.state.userInfo).length
    }
  }
}
</script>

<style scoped>

</style>