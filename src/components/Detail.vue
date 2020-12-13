<template>
  <div id="detail">
    <h2 @click="visible">Detail{{ show ? "▼" : "▶" }}</h2>

    <transition>
      <div style="width:100%" v-show="show">

        <div id="level-select">
          <h3>難易度選択</h3>
          <label class="col-2">
            <select class="form-control" name="level" v-model="selected_level">
              <option v-for="(level,key) in table.levels" :key="key">{{ level }}</option>
            </select>
          </label>
          <label for="all_list" class="col-2">
            <input type="checkbox" id="all_list" v-model="filter.visible_all_levels">
            全曲表示
          </label>
        </div>

        <table class="table detail">
          <thead>
          <td v-for="type in config().DETAIL_COLUMNS.filter(c => filter.columns[c])" @click="this.filter.set_sort(type)"
              :class="title_class(type)"
              :key="type">
            {{ config().DETAIL_TITLE_MAP[type] }}
          </td>
          </thead>
          <tr v-for="(song, index) in sorted" :key="song.title + index" :class="clear_type_class(song)">
            <td v-for="type in config().DETAIL_COLUMNS.filter(c => filter.columns[c])" :class="row_class(type, song)"
                :key="type">
              {{ song.get(type) }}
            </td>
          </tr>
        </table>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../const.js';
import Filter from "../models/filter";

export default {
  name: "Detail",
  props: {
    table: {
      type: Object,
      required: true
    },
    songs: {
      type: Array,
      required: true
    },
    filter: {
      type: Filter,
      required: true,
    }
  },
  data: () => ({
    selected_level: "",
    show: true,
  }),
  methods: {
    config() {
      return config;
    },
    title_class(type) {
      let ret = '';
      if (this.filter.sort_key === type) {
        ret += 'sort_active'
      }
      if (type === 'title' || type === 'date') {
        ret += ' ' + type;
      }
      return ret;
    },
    row_class(type, song) {
      let ret = type;
      switch (type) {
        case 'clear':
          ret += ' table-' + song.clear_type;
          break;
        case 'clear_before':
          ret += ' table-' + song.clear_type_before;
          break;
        case 'rate':
          ret += ' bg-' + song.clear_rank;
          break;
      }
      return ret;
    },
    level_index() {
      for (let i = 0; i < this.table.levels.length; i++) {
        if (this.table.levels[i] === this.selected_level) {
          return i;
        }
      }
      this.selected_level = this.table.levels[0];
      return 0;
    },
    visible() {
      this.show = !this.show;
    },
    clear_type_class(song) {
      return "table-line-" + song.clear_type;
    },
  },
  created: function () {
    this.selected_level = this.table.levels[0];
  },
  computed: {
    active: function () {
      if (this.filter.visible_all_levels) {
        return this.songs.map(songs_by_level => songs_by_level.songs).flat();
      } else {
        return this.songs[this.level_index()].songs;
      }
    },
    sorted: function () {
      let songs = this.active;
      if (!songs) {
        return this.config().SONG_FORMAT[0][0].songs;
      }
      return songs.sort(function (a, b) {
        let valA = a.sort_key(this.filter.sort_key, this.table.levels);
        let valB = b.sort_key(this.filter.sort_key, this.table.levels);
        return valA === valB ? 0 : ((valA < valB) ^ this.filter.sort_desc) ? -1 : 1;
      }.bind(this))
    }
  },

}

</script>

<style scoped>
.detail table {
  table-layout: fixed;
}

.sort_active {
  background-color: #e0e0e0;
}

.title {
  min-width: 360px;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear, .clear_before {
  width: 30px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date, .clear_date, .bp_date, .score_date {
  width: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.column {
  display: inline
}
</style>