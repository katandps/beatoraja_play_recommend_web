<template>
  <div id="viewer">
    <div v-if="model.is_initialized()">
      <div class="form-group row">
        <div class="btn-group col-sm-12">
          <label class="btn btn-outline-secondary col-sm-4">
            <input type="radio" v-model="viewType" value="lamp"/>
            ランプグラフ
          </label>
          <label class="btn btn-outline-secondary col-sm-4">
            <input type="radio" v-model="viewType" value="rank"/>
            ランクグラフ
          </label>
          <label class="btn btn-outline-secondary col-sm-4">
            <input type="radio" v-model="viewType" value="detail"/>
            詳細表
          </label>
        </div>
      </div>

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

export default {
  name: "Viewer",
  components: {LampGraph, Detail, RankGraph},
  props: {
    model: {
      type: Model,
      require: true,
    }
  },
  data: () => ({
    viewType: "detail"
  })
}
</script>

<style scoped></style>
