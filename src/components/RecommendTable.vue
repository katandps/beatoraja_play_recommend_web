<template>
  <div>
    このURLをbeatorajaに追加して下さい。
    現在はSatelliteからのみ選出されます。
  </div>
</template>

<script>
import Api from "../api";

export default {
  name: "RecommendTable",
  props: {
    user_id: {
      type: Number,
      required: true
    }
  },
  head() {
    return {
      meta: [{
        name: 'bmstable',
        content: Api.get_table_header_url(this.user_id),
      }]
    }
  },
}
</script>

<style scoped>

</style>