<template>
  <div id="home">
    <h1>Welcome to Beatoraja Play Recommend</h1>
    <h2>これは何</h2>
     Beatorajaのプレイデータ保管/閲覧サービスです。
    スコアログのデータから、更新できそうな譜面をピックアップできます。

    <h2>使い方</h2>
     メニューの前半がログイン不要メニュー、後半がログインメニューとなっています。
    ログインはGoogle OAuthをサポートしています。
  </div>
</template>

<script>
export default {
  name: "Home"
}
</script>

<style scoped>
#home {
  padding-top: 20px;
}
</style>