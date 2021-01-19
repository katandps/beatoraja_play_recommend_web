<template>
  <div id="detail">
    <div class="form-group row align-items-center">
      <div class="input-group col-sm-6" role="group">
        <div class="input-group-prepend">
          <label for="all_list" class="btn btn-info text-nowrap">
            全難易度表示
          </label>
        </div>
        <input class="form-control" type="checkbox" id="all_list"
               v-model="model.filter.visible_all_levels">
      </div>
      <div class="input-group col-sm-6" role="group">
        <div class="input-group-prepend">
          <label for="max_length" class="btn btn-info text-nowrap">
            表示曲数
          </label>
        </div>
        <input id="max_length" v-model="model.filter.max_length"
               class="form-control">
        <div class="input-group-append">
          <label for="max_length" class="btn btn-info text-nowrap">曲</label>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <div class="table detail">
        <div class="colgroup">
          <div class="col" v-for="obj in model.get_active_columns()"
               :class="obj.class" :key="obj.key"/>
        </div>
        <div class="thead">
          <div class="tr">
            <div class="th sticky-top"
                 v-for="obj in model.get_active_columns()"
                 @click="model.filter.set_sort(obj.key)"
                 :class="header_class(obj)"
                 :key="obj.key">
              {{ obj.title }}
            </div>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in model.get_sorted_song_list()"
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
  methods: {
    header_class(obj) {
      let ret = obj.class;
      ret += this.model.sort_key_is(obj.key) ? ' sort_active' : ' sort_inactive'
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
  },
}

</script>

<style scoped>
.sort_active {
  background-color: #e0e0e0;
}

.sort_inactive {
  background-color: #ffffff;
}

.title {
  min-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear, .clear_before {
  width: 12px;
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
  width: 1px;
  white-space: nowrap;
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
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
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

.th {
  display: table-cell;
  padding: .3rem;
  font-size: .8rem;
}

.td {
  display: table-cell;
  padding: .3rem;
  font-size: .8rem;
}

.flip-list-move {
  transition: transform 800ms;
}


</style>