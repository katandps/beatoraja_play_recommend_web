<template>
  <div id="detail">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()" :can_level_select="true"/>
    <div class="form-group row align-items-center">
      <level-selector :model="model" class="col-sm-6"/>
      <display-songs-limiter :model="model" class="col-sm-6"/>
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
import TableSelector from "./TableSelector";
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
    TableSelector,
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
  methods: {
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
  }
}
</script>

<style scoped></style>