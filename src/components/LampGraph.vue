<template>
  <div id="lamp-graph">
    <h1>ランプグラフ</h1>
    <table style="width:100%">
      <tr v-for="(level, key) in songs[table_index()]" :key="key" style="width:100%">
        <td style="width:30px">{{ tables[table_index()].levels[key] }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="clear_type in lamp_type" :key="clear_type"
              :class="'progress-bar bg-' + clear_type"
              role="progressbar"
              :style="'width: ' + level.count[clear_type].count * 100 + '%;color:#000'"
          >
            {{ level.count[clear_type].count }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "LampGraph",
  props: {
    tables: {
      type: Array,
      required: true
    },
    selected_table: {
      type: String,
      required: true
    }
  },
  data: () => ({
    songs: [],
    lamp_type: [
      "Max",
      "Perfect",
      "FullCombo",
      "ExHard",
      "Hard",
      "Normal",
      "Easy",
      "LightAssistEasy",
      "AssistEasy",
      "Failed",
      "NoPlay",
    ],
  }),
  methods: {
    fetch_detail() {
      fetch("https://bms.katand.net/lamp/").then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            for (let i = 0; i < this.tables.length; i++) {
              this.songs.splice(i, 1, json[i].LampGraph.levels)
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
    this.fetch_detail();
  }
}
</script>

<style scoped>

</style>