<template>
  <div id="detail">
    <h2 @click="visible">Detail{{ show ? "▼" : "▶" }}</h2>

    <transition>
      <div style="width:100%" v-show="show">

        <div id="level-select">
          <h3>難易度選択</h3>
          <label class="col-2">
            <select class="form-control" name="level" v-model="selected_level">
              <option v-for="(level,key) in model.get_selected_table().levels" :key="key">{{ level }}</option>
            </select>
          </label>
          <label for="all_list" class="col-2">
            <input type="checkbox" id="all_list" v-model="model.filter.visible_all_levels">
            全曲表示
          </label>
          <label for="max_length">
            表示曲数:
            <input id="max_length" v-model="model.filter.max_length" class="col-3">
            曲
          </label>
        </div>

        <table class="table detail">
          <thead>
          <td v-for="type in model.get_active_columns()"
              @click="model.filter.set_sort(type)"
              :class="title_class(type)"
              :key="type">
            {{ config().DETAIL_TITLE_MAP[type] }}
          </td>
          </thead>
          <tr v-for="song in model.get_sorted_song_list(selected_level)" :key="song.sha256"
              :class="clear_type_class(song)">
            <td v-for="type in model.get_active_columns()"
                :class="row_class(type, song)"
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
import config from '../../const.js';
import Model from "../../models/model";

export default {
  name: "Detail",
  props: {
    model: {
      type: Model,
      require: true,
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
      if (this.model.filter.sort_key === type) {
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
    visible() {
      this.show = !this.show;
    },
    clear_type_class(song) {
      return "table-line-" + song.clear_type;
    },
    set_default_selected_level() {
      const table = this.model.get_selected_table()
      if (!table.contains_level(this.selected_level)) {
        this.selected_level = table.levels[0]
      }
    }
  },
  mounted() {
    this.set_default_selected_level()
  },
  watch: {
    'model.selected_table': {
      handler() {
        this.set_default_selected_level()
      }
    }
  }
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