<template>
  <div id="recent">
    <div class="row align-items-center">
      <display-songs-limiter class="col-sm-6" :model="model"/>
    </div>
    <hr/>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col" v-for="obj in model.get_recent_columns()"
               :class="obj.class" :key="obj.key"/>
        </div>

        <div class="thead">
          <div class="tr">
            <div class="th sticky-top"
                 v-for="obj in model.get_recent_columns()"
                 :class="header_class(obj)"
                 :key="obj.key">
              {{ obj.title }}
            </div>
          </div>
        </div>
        <transition-group tag="div" class="tbody" name="flip-list">
          <div v-for="song in model.get_recent_song_list()"
               :key="song.md5"
               :class="clear_type_class(song)" class="tr">
            <div class="td" v-for="obj in model.get_recent_columns()"
                 :class="row_class(obj, song)"
                 :key="obj.key">
              <span v-html="song.get(obj.key)"/>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import Model from "../../../models/model";
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter";
import config from "../../../const";

export default {
  name: "Recent",
  components: {
    DisplaySongsLimiter,
  },
  props: {
    model: {
      type: Model,
      require: true,
    }
  },
  methods: {
    header_class(obj) {
      return obj.class + ' sort_inactive';
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
    /**
     * @param {string} table
     */
    set_table(table) {
      this.model = this.model.set_table(table)
    },
  }
}
</script>

<style scoped></style>