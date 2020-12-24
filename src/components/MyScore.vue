<template>
  <div id="my_score">
    <Viewer :songs="songs" title="マイスコア" @fetch_detail="fetch_detail" @update_date="update_date"/>
  </div>
</template>

<script>
import Viewer from "./viewer/Viewer";
import Api from "../api.js"

export default {
  name: "MyScore",
  components: {Viewer},
  data: () => ({
    songs: null,
    date: "",
  }),
  methods: {
    async fetch_detail() {
      this.songs = await Api.fetch_my_score(this.date, this.$store.getters.token);
    },
    update_date(date) {
      this.date = date;
    },
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
          this.fetch_detail()
      }
    }
  }
}
</script>

<style scoped>
#my_score {
  padding-top: 20px;
}
</style>