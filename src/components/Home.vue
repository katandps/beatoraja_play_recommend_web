<template>
  <div id="home">
    <h1>Welcome to Beatoraja Play Recommend</h1>
    <h2>これは何</h2>
     Beatorajaのプレイデータ保管/閲覧サービスです。
    スコアログのデータから、更新できそうな譜面をピックアップできます。

    <h2>使い方</h2>
     メニューの前半がログイン不要メニュー、後半がログインメニューとなっています。
    ログインはGoogle OAuthをサポートしています。

    <h2>その他</h2>
     管理者(かたんど)について<br/>
      <a href="https://twitter.com/dnaTaK">twitter@dnaTaK</a><br/>
      <router-link to="/view/?user_id=1">スコア表示</router-link><br/>
    <ReleaseNote />
  </div>
</template>

<script>
import ReleaseNote from "./ReleaseNote";

export default {
  name: "Home",
  components: {ReleaseNote}
}
</script>

<style scoped>
#home {
  padding-top: 20px;
}
</style>