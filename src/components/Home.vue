<template>
  <div id="home">
    <h1>Welcome to Beatoraja Play Recommend</h1>
    <h2>これは何</h2>
    <p>
      Beatorajaのプレイデータ保管/閲覧サービスです。<br/>
      スコアログのデータから、更新できそうな譜面をピックアップできます。
    </p>
    <h2>使い方</h2>
    <p>右上のハンバーガーメニューからメインメニューが開けます。</p>
    <h3>自分のスコアを閲覧する</h3>
    <p>メニューから、<em>登録/ログイン</em>をクリックします。(Googleのログインページが開きます)<br />
    ログインに成功すると、ハンバーガーメニューが緑色になり、データのアップロードができるようになります。</p>
    <p><em>スコアアップロード</em>から、score.dbとscorelog.dbをアップロードすることで<em>マイスコア</em>より、自分のスコアが確認できます。<br />Twitterへの共有もこちらで行なえます。</p>

    <h2>その他</h2>
    管理者(かたんど)について<br/>
    <a href="https://twitter.com/dnaTaK">twitter@dnaTaK</a><br/>
    <router-link to="/view/?user_id=1">スコア表示</router-link>
    <br/>
    <ReleaseNote/>
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