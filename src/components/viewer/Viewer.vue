<template>
  <div id="viewer">
    <div v-if="model.is_initialized()">
      <div class="form-group row">
        <div class="btn-group col-sm-12">
          <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
            <input type="radio" v-model="viewType" value="lamp"/>
            ランプグラフ
          </label>
          <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
            <input type="radio" v-model="viewType" value="rank"/>
            ランクグラフ
          </label>
          <label class="btn btn-outline-secondary col-sm-4 text-nowrap">
            <input type="radio" v-model="viewType" value="detail"/>
            詳細表
          </label>
        </div>
      </div>

      <DateSelector @setDate="set_date" />
      <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set ()"/>
      <hr>
      <LampGraph :model="model" v-if="viewType === 'lamp'"/>
      <RankGraph :model="model" v-if="viewType === 'rank'"/>
      <Detail :model="model" v-if="viewType === 'detail'"/>
    </div>
  </div>
</template>

<script>
import Detail from "./Detail";
import LampGraph from "./LampGraph";
import RankGraph from "./RankGraph";
import Model from "../../models/model";
import TableSelector from "./TableSelector";
import DateSelector from "./DateSelector";

export default {
  name: "Viewer",
  components: {DateSelector, LampGraph, Detail, RankGraph, TableSelector},
  props: {
    model: {
      type: Model,
      require: true,
    }
  },
  data: () => ({
    viewType: "detail"
  }),
  methods: {
    /**
     * @param {string} table
     */
    set_table(table) {
      this.$emit('setTable', table);
    },
    set_date(date) {
      this.$emit('setDate', date);
    },
  }
}
</script>

<style scoped></style>
