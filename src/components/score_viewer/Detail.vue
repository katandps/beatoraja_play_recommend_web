<template>
  <div id="detail">
    <div class="form-group row align-items-center">
      <level-selector :model="model"/>
      <display-songs-limiter :model="model"/>
    </div>
    <hr>
    <FilterPreset :model="model"/>
    <SongFilterController :model="model"/>
    <DetailColumns :model="model"/>
    <hr>
    <DetailTable :model="model"/>
  </div>
</template>

<script>
import SongFilterController from "./detail/SongFilterController";
import DetailColumns from "./detail/DetailColumns";
import FilterPreset from "./detail/FilterPreset";
import Model from "../../models/model";
import DetailTable from "./detail/DetailTable";
import LevelSelector from "./detail/LevelSelector";
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter";

export default {
  name: "Detail",
  components: {
    DisplaySongsLimiter,
    LevelSelector,
    DetailTable,
    FilterPreset,
    DetailColumns,
    SongFilterController
  },
  props: {
    model: {
      type: Model,
      require: true,
    }
  },
}
</script>

<style scoped></style>