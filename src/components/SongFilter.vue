<template>
  <div id="song_filter">
    <h4 @click="filter_visible">表示フィルタ{{ show ? "▼" : "▶" }}</h4>
    <transition>
      <div v-show="show">
        <div class="filter">
          <h5>クリアタイプ</h5>
          <div v-for="lamp in config().LAMP_TYPE" :key="lamp">
            <label :for="lamp">
              <input type="checkbox" :id="lamp" :value="lamp" v-model="checked_lamp">
              {{ lamp }}
            </label>
          </div>
          <button class="btn btn-success" @click="filter_all">全表示</button>
          <button class="btn btn-success" @click="filter_not_full_combo">未FC</button>
          <button class="btn btn-success" @click="filter_not_ex_hard">未EXH</button>
          <button class="btn btn-success" @click="filter_not_hard">未HARD</button>
          <button class="btn btn-success" @click="filter_not_easy">未EASY</button>
        </div>

        <div class="filter">
          <h5>スコアランク</h5>
          <div v-for="rank in config().RANK_TYPE" :key="rank">
            <label :for="rank">
              <input type="checkbox" :id="rank" :value="rank" v-model="checked_rank">
              {{ rank }}
            </label>
          </div>
        </div>

        <div class="filter">
          <h5>更新日時</h5>
          <button class="btn btn-success" @click="filter_all_term">全期間</button>
          <button class="btn btn-success" @click="filter_older_half_year">半年以上更新なし</button>
          <button class="btn btn-success" @click="filter_older_one_year">1年以上更新なし</button>
          <button class="btn btn-success" @click="filter_older_two_year">2年以上更新なし</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from "../const";

export default {
  name: "SongFilter",
  data: () => ({
    checked_lamp: config.LAMP_TYPE.slice(),
    checked_rank: config.RANK_TYPE.slice(),
    day: 0,
    show: true,
  }),
  methods: {
    config() {
      return config;
    },
    filter_visible() {
      this.show = !this.show;
    },
    filter_all() {
      this.checked_lamp = config.LAMP_TYPE.slice();
    },
    filter_not_full_combo() {
      this.filter_all();
      this.checked_lamp.splice(this.checked_lamp.indexOf("Max"), 1);
      this.checked_lamp.splice(this.checked_lamp.indexOf("Perfect"), 1);
      this.checked_lamp.splice(this.checked_lamp.indexOf("FullCombo"), 1);
    },
    filter_not_ex_hard() {
      this.filter_not_full_combo();
      this.checked_lamp.splice(this.checked_lamp.indexOf("ExHard"), 1);
    },
    filter_not_hard() {
      this.filter_not_ex_hard();
      this.checked_lamp.splice(this.checked_lamp.indexOf("Hard"), 1);
    },
    filter_not_easy() {
      this.filter_not_hard();
      this.checked_lamp.splice(this.checked_lamp.indexOf("Normal"), 1);
      this.checked_lamp.splice(this.checked_lamp.indexOf("Easy"), 1);
    },
    filter_all_term() {
      this.day = 0;
    },
    filter_older_half_year() {
      this.day = 180;
    },
    filter_older_one_year() {
      this.day = 365;
    },
    filter_older_two_year() {
      this.day = 730;
    }
  },
  watch: {
    checked_lamp: {
      immediate: true,
      handler: function () {
        this.$emit('updateSongFilter', this.checked_lamp, this.checked_rank, this.day);
      }
    },
    checked_rank: {
      immediate: true,
      handler: function () {
        this.$emit('updateSongFilter', this.checked_lamp, this.checked_rank, this.day);
      }
    },
    day: {
      immediate: true,
      handler: function () {
        this.$emit('updateSongFilter', this.checked_lamp, this.checked_rank, this.day);
      }
    }
  }
}
</script>

<style scoped>
.filter button {
  margin: 10px;
  display: inline
}
</style>