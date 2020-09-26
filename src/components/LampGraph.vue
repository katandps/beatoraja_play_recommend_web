<template>
  <div id="lamp-graph">
    <h1>ランプグラフ</h1>
    {{ selected_table }}
    <table style="width:100%">
      <tr v-for="(level, key) in songs[table_index()]" :key="key" style="width:100%">
        <td style="width:15%">{{ tables[table_index()].levels[key] }}</td>
        <td class="progress" style="width:100%;height:1.8em">
          <div
              v-for="clear_type in lamp_type" :key="clear_type"
              :class="'progress-bar bg-' + clear_type"
              role="progressbar"
              :style="'width: ' + level.count[clear_type].count * 100 + '%'"
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
  data: () => ({
    tables: [{"name": "", "levels": []}],
    songs: [],
    selected_table: "",
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
    fetch_detail(index) {
      fetch("https://bms.katand.net/lamp/" + index).then(response => {
        return response.json()
      })
          .then(json => {
            console.log(json);
            this.songs.splice(index, 1, json.LampGraph.levels);
          })
          .catch((err) => {
            this.msg = err
          });
    },
    fetch_tables() {
      fetch("https://bms.katand.net/tables/").then(response => {
        return response.json()
      }).then(json => {
        console.log(json);
        this.tables = json;
        this.selected_table = json[0].name;
        this.songs = Array(json.length);
        for (let i = 0; i < json.length; i++) {
          this.fetch_detail(i);
        }
      }).catch((err) => {
        console.error(err);
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
    this.fetch_tables();
  }
}
</script>

<style scoped>

</style>