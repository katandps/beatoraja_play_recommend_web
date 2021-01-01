<template>
  <div id="table_selector">
    <h6 class="sidebar-title" @click="selector_visible">難易度表選択{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <label>
          <select class="form-control table-listbox" name="table" v-model="tables.selected_table">
            <option v-for="(table,key) in tables.list()" :key="key">{{ table.name }}</option>
          </select>
        </label>
      </div>
    </transition>
  </div>
</template>

<script>
import Api from "../../api.js"
import Tables from "../../models/table";

export default {
  name: "TableSelector",
  data: () => ({
    tables: new Tables([]),
    show: true,
  }),
  methods: {
    selector_visible() {
      this.show = !this.show;
    },
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
  width: 320px;
  box-sizing: border-box
}

.table-listbox {
  height: 100%;
  width: 100%;
}
</style>