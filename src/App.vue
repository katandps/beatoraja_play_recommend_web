<template>
  <div id="app" class="mx-auto" style="width: 80%">
    <LampGraph />
    <Detail />
  </div>
</template>

<script>
import Detail from "./components/Detail";
import LampGraph from "./components/LampGraph";

export default {
  name: "App",
  components: {LampGraph, Detail},
};
</script>

<style></style>