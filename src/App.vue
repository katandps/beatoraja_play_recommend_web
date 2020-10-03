<template>
  <div id="app" class="mx-auto" style="width: 80%">
    <h1>難易度選択</h1>
    <label>
      <select class="form-control" name="table" v-model="selected_table">
        <option v-for="(table,key) in tables" :key="key">{{ table.name }}</option>
      </select>
    </label>

    <LampGraph :tables="tables" :selected_table="selected_table" v-if="has_loaded_tables"/>
    <RankGraph :tables="tables" :selected_table="selected_table" v-if="has_loaded_tables"/>
    <Detail :tables="tables" :selected_table="selected_table" v-if="has_loaded_tables"/>
  </div>
</template>

<script>
import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";
import RankGraph from "./components/RankGraph";

export default {
  name: "App",
  components: {LampGraph, Detail, RankGraph},
  data: () => ({
    tables: [],
    selected_table: "",
  }),
  methods: {
    fetch_tables() {
      fetch(process.env.VUE_APP_HOST + "tables/").then(response => {
        return response.json()
      }).then(json => {
        console.log(json);
        this.tables = json;
        this.selected_table = json[0].name;
      }).catch((err) => {
        console.error(err);
      });
    },
  },
  computed: {
    has_loaded_tables() {
      return this.tables.length !== 0;
    }
  },
  created: function () {
    this.fetch_tables();
  }
};
</script>

<style></style>