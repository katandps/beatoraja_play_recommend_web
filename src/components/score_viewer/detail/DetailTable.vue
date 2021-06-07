<template>
  <div class="table-wrapper">
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
          <div class="td text-nowrap" v-for="obj in model.get_active_columns()"
               :class="row_class(obj, song)"
               :key="obj.key">
            <span v-html="song.get(obj.key)"></span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import Model from "../../../models/model";
import config from "../../../const.js"

export default {
  name: "DetailTable",
  props: {model: {type: Model, require: true}},
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
          ret += ' table-' + config.LAMP_INDEX[song.clear_type];
          break;
        case 'clear_before':
          ret += ' table-' + config.LAMP_INDEX[song.clear_type_before];
          break;
        case 'rate':
          ret += ' bg-' + song.clear_rank;
          break;
      }
      return ret;
    },
    clear_type_class(song) {
      return "table-line-" + config.LAMP_INDEX[song.clear_type];
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

.table-wrapper {
  display: block;
  width: 100%;
  height: 90vh;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.table {
  display: table;
  table-layout: auto;
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
  font-weight: bold;
  position: sticky;
  top: -1px;
  z-index: 3;
  padding: .3rem;
  font-size: .8rem;
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
}

.td {
  display: table-cell;
  padding: .3rem;
  font-size: .8rem;
}

.flip-list-move {
  transition: transform 800ms;
}

/* Each Column CSS*/
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 360px;
}

.clear, .clear_before {
  width: 14px;
}

.date, .clear_date, .bp_date, .score_date {
  max-width: 80px;
  min-width: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bp .combo .play {
  width: 1px;
  white-space: nowrap;
}

.level {
  width: 1px;
  white-space: nowrap;
}

.rate {
  width: 1px;
  white-space: nowrap;
}
</style>