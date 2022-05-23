<template>
  <section id="home" class="container">
    <div class="jumbotron">
      <div class="container">
        <h1>Beatoraja Play Recommend</h1>
        <p>
          Beatorajaのプレイデータ保管/閲覧サービスです。<br />
          スコアログのデータから、更新できそうな譜面をピックアップできます。
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 panel">
        <h4>
          <router-link class="text-dark px-2" to="/">
            <font-awesome-icon :icon="['fas', 'home']" />
            ホーム
          </router-link>
        </h4>
        この画面です。
      </div>
      <div class="col-lg-3 panel">
        <h4>
          <router-link
            class="text-dark px-2"
            :to="{
              path: '/view',
              query: Object.assign({}, $route.query, { user_id: user_id })
            }"
          >
            <font-awesome-icon :icon="['fas', 'cubes']" />
            スコア閲覧
          </router-link>
        </h4>
        ユーザIDを指定して<br />スコアを閲覧できます。
      </div>
      <div class="col-lg-3 panel" v-if="is_login">
        <h4>
          <router-link class="text-dark px-2" :to="'/stats?user_id=' + user_id">
            <font-awesome-icon :icon="['fas', 'wrench']" />
            プレイ履歴
          </router-link>
        </h4>
        今までのプレイ履歴を<br />確認できます。
      </div>
      <div class="col-lg-3 panel" v-if="is_login">
        <h4>
          <router-link class="text-dark px-2" to="/mypage">
            <font-awesome-icon :icon="['fas', 'pencil-alt']" />
            マイページ
          </router-link>
        </h4>
        スコアを登録したり、<br />プロフィールが編集できます。
      </div>
      <div class="col-lg-3 panel" v-if="is_login">
        <h4>
          <router-link class="text-dark px-2" :to="'/table?user_id=' + user_id">
            <font-awesome-icon :icon="['fas', 'thumbs-up']" />
            おすすめ表
          </router-link>
        </h4>
        難易度表を指定して<br />おすすめ譜面の表を作ります。
      </div>
      <div class="col-lg-3 panel" v-if="is_login">
        <h4>
          <a
            class="text-dark px-3"
            href="javascript:void(0);"
            @click.prevent="handleSignOut"
          >
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
            ログアウト
          </a>
        </h4>
        ログアウトします。
      </div>
      <div class="col-lg-3 panel" v-if="!is_login">
        <h4>
          <a class="text-dark" :href="handleSignInUrl()">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
            登録/ログイン
          </a>
        </h4>
        ログインします。<br />Google OAuthを使用します。
      </div>
    </div>
    <hr />
    <div class="message">
      <h2>お知らせ</h2>
      <p>
        <font-awesome-icon :icon="['fas', 'wrench']" />
        がついている項目については製作中/不安定機能です。正常な動作が行えないか、動作が制限されています。
      </p>
    </div>
    <div class="message">
      <ReleaseNote />
    </div>
  </section>
</template>

<script>
import ReleaseNote from "./home/ReleaseNote"

export default {
  components: { ReleaseNote },
  props: {
    is_login: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleSignInUrl() {
      let client_id = process.env.VUE_APP_CLIENT_ID
      let redirect_url = process.env.VUE_APP_HOST + "/oauth"
      return (
        "https://accounts.google.com/o/oauth2/auth?" +
        "include_granted_scopes=true" +
        "&redirect_uri=" +
        redirect_url +
        "&scope=openid%20email%20profile" +
        "&response_type=code" +
        "&approval_prompt=force" +
        "&access_type=offline" +
        "&client_id=" +
        client_id
      )
    },
    async handleSignOut() {
      this.$emit("handleSignOut")
    }
  },
  computed: {
    user_id() {
      if (!this.$store.getters.userInfo) {
        return 1
      }
      return this.$store.getters.userInfo.user_id
    }
  },
  watch: {
    $route: function (to, from) {
      if (to.path !== from.path) {
        this.active_btn = false
      }
    }
  }
}
</script>

<style scoped>
#home {
  padding-top: 20px;
}

.panel {
  height: 120px;
  border-radius: 0.3rem;
  border: solid;
  padding-top: 10px;
  white-space: nowrap;
  color: #444488;
}
</style>
