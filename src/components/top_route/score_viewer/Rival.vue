<template>
  <div id="recent">
    <div class="row">
      <input-user-id :user_id="rival_id" @refresh="refresh_rival_id" class="col-sm-6"/>
      <display-songs-limiter class="col-sm-6" :model="model"/>
    </div>
    <TableSelector :model="model" @setTable="set_table" v-if="model.tables_is_set()"
                   :can_level_select="true"/>
    <hr/>
    <div class="table-wrapper">
      <div class="score-table">
        <div class="colgroup">
          <div class="col" v-for="obj in columns"
               :class="obj.class" :key="obj.key"/>
        </div>

        <div class="thead">
          <div class="tr">
            <div class="th sticky-top"
                 v-for="obj in columns"
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
            <div class="td" v-for="obj in columns"
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
import Model from "../../../models/model"
import DisplaySongsLimiter from "./detail/DisplaySongsLimiter"
import TableSelector from "./TableSelector"
import InputUserId from "./InputUserId"
import config from "../../../const"

export default {
  name: "Rival",
  components: {
    DisplaySongsLimiter,
    TableSelector,
    InputUserId,
  },
  props: {
    model: {
      type: Model,
      require: true,
    },
    rival_id: {
      type: Number,
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
          ret += ' table-' + config.LAMP_INDEX[song.clear_type];
          break;
        case 'clear_before':
          ret += ' table-' + config.LAMP_INDEX[song.clear_type_before];
          break;
        case 'clear_diff_rival':
          ret += ' table-' + config.LAMP_INDEX[song.rival_clear_type];
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
    async refresh_rival_id(rival_id) {
      let query = Object.assign({}, this.$route.query)
      query.rival_id = rival_id
      await this.$router.push({query: query})
    }
  },
  computed: {
    columns() {
      return config.RIVAL_COLUMNS
    }
  },
}
</script>

<style scoped></style>