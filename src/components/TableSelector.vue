<template>
  <div id="table_selector">
    <label>
      <select class="form-control " name="table" v-model="selected_table" style="height:100%; width:100%">
        <option v-for="(table,key) in tables" :key="key">{{ table.name }}</option>
      </select>
    </label>
  </div>
</template>

<script>
export default {
  name: "TableSelector",
  data: () => ({
    tables: [],
    selected_table: "",
  }),
  methods: {
    fetch_tables() {
      fetch(process.env.VUE_APP_HOST + "tables/").then(response => {
        return response.json()
      }).then(json => {
        this.tables = json;
        this.selected_table = json[0].name;
      }).catch((err) => {
        console.error(err);
      });
    },
  },
  created: function () {
    this.fetch_tables();
  },
  computed: {
    table_index() {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].name === this.selected_table) {
          return i;
        }
      }
      return 0;
    },
  },
  watch: {
    selected_table: {
      immediate: true,
      handler: function () {
        this.$emit('getTable', this.tables[this.table_index]);
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