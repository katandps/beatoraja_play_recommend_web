<template>
  <div id="viewer">
    <div v-if="model.is_initialized()">
      <LampGraph :model="model"/>
      <RankGraph :model="model"/>
      <Detail :model="model"/>
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
}
</script>

<style scoped></style>
