<template>
  <div id="stat">
    <TableSelector :model="model" :filter="filter" @setTable="set_table" v-if="model.tables_is_set()" :can_level_select="true"/>
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
import SongFilter from "../../../models/songFilter"

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
    filter: {
      type: SongFilter,
      required: true,
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
    lamp_stat() {
      return this.model.get_lamp_stat(this.filter)
    },
    rank_stat() {
      return this.model.get_rank_stat(this.filter)
    }
  }
}
</script>

<style scoped>

</style>