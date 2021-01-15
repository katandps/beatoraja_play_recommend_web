<template>
  <div id="release-note">
    <h2>更新履歴</h2>
    <ul>
      <li v-for="(row, index) in list()" :key="index">{{row}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ReleaseNote",
  methods: {
    list() {
      return [
          "2021/01/13 グラフエリアのクリックで対象曲リストを表示する",
          "2021/01/07 フィルターの状態の保存機能を実装",
          "2021/01/06 IRへのリンクを追加",
          "2021/01/02 名前登録、Twitter共有実装",
          "2021/01/01 ランダムセレクト実装",
          "2020/12/30 ログイン機能実装",
      ];
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
}
</style>