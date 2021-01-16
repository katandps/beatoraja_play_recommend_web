<template>
  <div class="sidebar">
    <FilterPreset :model="model" class="header-item"/>
    <SongFilterController :model="model" class="header-item"/>
    <DetailColumns :model="model" class="header-item"/>
  </div>
</template>

<script>
import SongFilterController from "./SongFilterController";
import DetailColumns from "./DetailColumns";
import FilterPreset from "./FilterPreset";
import Model from "../../models/model";

export default {
  name: "Sidebar",
  components: {DetailColumns, SongFilterController, FilterPreset},
  props: {
    model: {
      type: Model,
      required: true,
    },
  },
}

</script>

<style scoped>
.sidebar {
  background-color: #191970;
  color: #ffffff;
  height: 100%; /* サイドバーの高さ */
  width: 320px; /* サイドバーのwidthを指定 */
  max-width: 320px; /* widthの最大値 */
  opacity: 0.90; /* 透過する 0に近くほど透過する */
  position: fixed; /* 左上に要素を固定する(スクロールしても位置は固定される) */
  overflow-x: hidden; /* 横軸ではみ出た要素を非表示にする */
  overflow-y: scroll; /* スクロールバーを常に表示 */
  box-sizing: border-box; /* paddingとborderを、widthとheightに含める */
  padding-top: 20px;
  padding-bottom: 60px;
}

.header-item {
  padding-right: 20px;
}

/deep/ .sidebar-title {
  margin-left: 20px;
  text-align: left;
}

/deep/ .sidebar-body {
  margin-left: 30px;
  text-align: left;
}

</style>