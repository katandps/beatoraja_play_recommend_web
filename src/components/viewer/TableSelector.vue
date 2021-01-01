<template>
  <div id="table_selector">
    <label>
      <select class="form-control " name="table" v-model="tables.selected_table" style="height:100%; width:100%">
        <option v-for="(table,key) in tables.list()" :key="key">{{ table.name }}</option>
      </select>
    </label>
  </div>
</template>

<script>
import Api from "../../api.js"
import Tables from "../../models/table";

export default {
  name: "TableSelector",
  data: () => ({
    tables: new Tables([]),
  }),
  methods: {
    async fetch_tables() {
      const json = await Api.fetch_tables(this.$cookies.get("session-token"));
      this.tables = new Tables(json);
    }
  },
  created: function () {
    this.fetch_tables();
  },
  watch: {
    tables: {
      immediate: true,
      handler: function () {
        this.$emit('setTable', this.tables.get_table());
      }
    },
  }
}
</script>

<style scoped>
#table_selector {
  height: 80px;
  width: 320px;
  box-sizing: border-box
}
</style>