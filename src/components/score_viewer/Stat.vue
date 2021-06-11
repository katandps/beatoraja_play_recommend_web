<template>
  <div id="stat">
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()"/>
    <table style="width:100%; table-layout:fixed">
      <thead>
      <tr>
        <th v-for="type in config().RANK_TYPE" :key="type"> {{ type }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-for="type in config().RANK_TYPE" :key="type"> {{ 123 }}</td>
      </tr>
      </tbody>
    </table>
    <table style="width:100%; table-layout:fixed">
      <thead>
      <tr>
        <th v-for="type in config().LAMP_TYPE" :key="type" style="font-size: 0.7em"> {{ type }}</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-for="type in config().LAMP_TYPE" :key="type"> {{ 123 }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableSelector from "./TableSelector"
import Model from "../../models/model"
import config from "../../const.js"

export default {
  name: "Stat",
  components: {
    TableSelector,
  },
  props: {
    model: {
      type: Model,
      require: true
    }
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
  }
}
</script>

<style scoped>

</style>