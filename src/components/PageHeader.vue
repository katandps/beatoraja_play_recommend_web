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
            <a v-if="!is_login" class="text-dark px-3" :href="handleSignInUrl()">ログイン</a>
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
  props: {
    is_login: {
      type: Boolean,
      required: true,
    }
  },
  methods: {
    handleSignInUrl() {
      let client_id = process.env.VUE_APP_CLIENT_ID;
      let redirect_url = process.env.VUE_APP_HOST + "/oauth";
      return "https://accounts.google.com/o/oauth2/auth?" +
          "include_granted_scopes=true" +
          "&redirect_uri=" + redirect_url +
          "&scope=openid" +
          "&response_type=code" +
          "&approval_prompt=force" +
          "&access_type=offline" +
          "&client_id=" + client_id;
    },
    async handleSignOut() {
      this.$emit("handleSignOut");
    }
  },
}
</script>

<style scoped>

</style>