<template>
  <div id="detail">
    <div class="wrap">
      <div id="level-select">
        <h3>難易度選択</h3>
        <label class="col-2">
          <select class="form-control" name="level" v-model="selected_level">
            <option v-for="(level,key) in model.get_selected_table().level_list"
                    :key="key">{{ level }}
            </option>
          </select>
        </label>
        <label for="all_list" class="col-2">
          <input type="checkbox" id="all_list"
                 v-model="model.filter.visible_all_levels">
          全曲表示
        </label>
        <label for="max_length">
          表示曲数:
          <input id="max_length" v-model="model.filter.max_length"
                 class="col-3">
          曲
        </label>
      </div>

      <div class="table detail">
        <div class="colgroup">
          <div class="col" v-for="obj in model.get_active_columns()"
               :class="obj.class" :key="obj.key"/>
        </div>
        <div class="thead">
          <div class="tr">
            <div class="td" v-for="obj in model.get_active_columns()"
                 @click="model.filter.set_sort(obj.key)"
                 :class="header_class(obj)"
                 :key="obj.key">
              {{ obj.title }}
            </div>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in model.get_sorted_song_list(selected_level)"
               :key="song.md5"
               :class="clear_type_class(song)" class="tr">
            <div class="td" v-for="obj in model.get_active_columns()"
                 :class="row_class(obj, song)"
                 :key="obj.key">
              <span v-html="song.get(obj.key)"></span>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
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
  }),
  methods: {
    header_class(obj) {
      let ret = obj.class;
      if (this.model.sort_key_is(obj.key)) {
        ret += ' sort_active'
      }
      return ret;
    },
    row_class(obj, song) {
      let ret = obj.class;
      switch (obj.key) {
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
    clear_type_class(song) {
      return "table-line-" + song.clear_type;
    },
    set_default_selected_level() {
      const table = this.model.get_selected_table()
      if (!table.contains_level(this.selected_level)) {
        this.selected_level = table.level_list[0]
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
    },
  }
}

</script>

<style scoped>
.wrap {
  width: 100%;
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
  max-width: 12px;
  min-width: 12px;
}

.date, .clear_date, .bp_date, .score_date {
  max-width: 80px;
  min-width: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bp .combo .play {
  max-width: 60px;
  min-width: 60px;
}

.level {
  min-width: 60px;
}

.rate {
  min-width: 60px;
  max-width: 60px;
}

.column {
  display: inline
}

.table {
  display: table;
  table-layout: auto;
  overflow: scroll;
}

.colgroup {
  display: table-column-group;
}

.col {
  display: table-column;
}

.thead {
  display: table-header-group;
}

.tbody {
  display: table-row-group;
}

.tr {
  display: table-row;
}

.td {
  display: table-cell;
  padding: .4rem;
  font-size: .9rem;
}

.flip-list-move {
  transition: transform 800ms;
}
</style>