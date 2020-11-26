<template>
  <div id="rank-graph">
    <h1>ランクグラフ</h1>
    <table style="width:100%">
      <tr v-for="(level, key) in songs[table_index()]" :key="key" style="width:100%">
        <td style="width:30px">{{ tables[table_index()].levels[key] }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="rank in score_rank" :key="rank"
              :class="'progress-bar bg-' + rank"
              role="progressbar"
              :style="'width: ' + level[rank] * 100 + '%;color:#000'"
          >
            {{ level[rank] }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "RankGraph",
  props: {
    tables: {
      type: Array,
      required: true
    },
    selected_table: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data: () => ({
    songs: [],
    score_rank: [
      "AAA",
      "AA",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ],
  }),
  methods: {
    fetch_detail() {
      fetch(process.env.VUE_APP_HOST + "rank/?date=" + this.date).then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            for (let i = 0; i < this.tables.length; i++) {
              this.songs.splice(i, 1, json[i].levels);
            }
          })
          .catch((err) => {
            this.msg = err
          });
    },
    table_index() {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].name === this.selected_table) {
          return i;
        }
      }
      console.error("難易度表が読み込まれてなさそうです");
      return 0;
    },
  },
  created: function () {
    this.songs = Array(this.tables.length);
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.fetch_detail();
      }
    }
  }
}
</script>

<style scoped>

</style>