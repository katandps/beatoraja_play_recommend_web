<template>
  <div id="stat">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()" :can_level_select="true"/>
    <hr>
    <h3>クリアランプ分布</h3>
    <table style="width:100%; table-layout:fixed">
      <thead>
      <tr>
        <th v-for="type in config().LAMP_TYPE" :key="type" style="font-size: 0.7em"> {{ type }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-for="index in config().LAMP_GRAPH_LIST" :key="index"> {{ lamp_stat[index].length }}</td>
      </tr>
      </tbody>
    </table>
    <hr>
    <h3>スコアランク分布</h3>
    <table style="width:100%; table-layout:fixed">
      <thead>
      <tr>
        <th v-for="type in config().RANK_TYPE" :key="type"> {{ type }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-for="(type, index) in config().RANK_TYPE" :key="type"> {{ rank_stat[index].length }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableSelector from "./selector/TableSelector"
import Model from "../../../models/model"
import config from "../../../const.js"
import SongDetail from "../../../models/song_detail"

export default {
  name: "Stat",
  components: {
    TableSelector,
  },
  props: {
    model: {
      type: Model,
      require: true
    },
  },
  methods: {
    config() {
      return config
    },
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
  },
  computed: {
    /**
     * @returns {SongDetail[][]}
     */
    lamp_stat() {
      if (!this.model.is_initialized()) {
        return []
      }
      let songs = this.model.filtered_score(this.$store.state.filter)
      if (!this.$store.state.filter.visible_all_levels) {
        songs = songs.filter(s => s.level === this.selected_level)
      }
      return config.LAMP_INDEX.map(
          (lamp, index) => songs.filter(s => s.clear_type === index).sort(SongDetail.cmp_title)
      )
    },

    /**
     * @returns {SongDetail[][]}
     */
    rank_stat() {
      if (!this.model.is_initialized()) {
        return []
      }
      let songs = this.model.filtered_score(this.$store.state.filter)
      if (!this.$store.state.filter.visible_all_levels) {
        songs = songs.filter(s => s.level === this.selected_level)
      }
      return config.RANK_TYPE.map(
          r => songs.filter(s => s.clear_rank === r).sort(SongDetail.cmp_title)
      )
    },
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>
