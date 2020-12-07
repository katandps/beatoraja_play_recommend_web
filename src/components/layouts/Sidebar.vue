<template>
  <div class="sidebar">
    <TableSelector @getTable="fetch_table" class="header-item"/>
    <DateSelector @getDate="update_date" class="header-item"/>
  </div>
</template>

<script>
import TableSelector from "../TableSelector";
import DateSelector from "../DateSelector";

export default {
  name: "Sidebar",
  components: {DateSelector, TableSelector},
  methods: {
    fetch_table(table) {
      this.$emit('getTable', table);
    },
    update_date(date) {
      this.$emit('getDate', date);
    }
  }
}

</script>

<style scoped>
.sidebar {
  background-color: #191970;
  color: #ffffff;
  height: 100%; /* サイドバーの高さ */
  width: 320px; /* サイドバーのwidthを指定 */
  max-width: 320px; /* widthの最大値 */
  opacity: 0.95; /* 透過する 0に近くほど透過する */
  position: fixed; /* 左上に要素を固定する(スクロールしても位置は固定される) */
  overflow-x: hidden; /* 横軸ではみ出た要素を非表示にする */
  box-sizing: border-box; /* paddingとborderを、widthとheightに含める */
}

.header-item {
  padding: 40px;
}

.sidebar-link-area {
  padding-top: 20px; /* サイドバーリンクの上部に空白を作る */
}

.sidebar-link {
  color: #ffffff; /* リンクの文字色を白に */
}

.sidebar-link:hover {
  color: #ffffff /* マウスがリンクに乗った時も文字色を白に */
}
</style>