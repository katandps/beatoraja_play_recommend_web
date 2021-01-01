<template>
  <div id="song_filter">
    <h6 class="sidebar-title" @click="filter_visible">表示フィルタ{{ show ? "▼" : "▶" }}</h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <div class="filter">
          <h5>クリアタイプ</h5>
          <div v-for="lamp in config().LAMP_TYPE" :key="lamp">
            <label :for="lamp" class="sidebar-list">
              <input type="checkbox" :id="lamp" :value="lamp" v-model="filter.visible_lamp[lamp]">
              {{ lamp }}
            </label>
          </div>
          <button class="btn btn-danger" @click="filter.visible_reverse()">表示反転</button>
          <button class="btn btn-success" @click="filter.visible_all_lamp_type()">全表示</button>
          <button class="btn btn-success" @click="filter.visible_not_full_combo()">未FC</button>
          <button class="btn btn-success" @click="filter.visible_not_ex_hard()">未EXH</button>
          <button class="btn btn-success" @click="filter.visible_not_hard()">未HARD</button>
          <button class="btn btn-success" @click="filter.visible_not_easy()">未EASY</button>
        </div>

        <div class="filter">
          <h5>スコアランク</h5>
          <div v-for="rank in config().RANK_TYPE" :key="rank">
            <label :for="rank">
              <input type="checkbox" :id="rank" :value="rank" v-model="filter.visible_rank[rank]">
              {{ rank }}
            </label>
          </div>
        </div>

        <div class="filter">
          <h5>更新日時</h5>
          <button class="btn btn-success" @click="filter.filter_all_term()">全期間</button>
          <button class="btn btn-success" @click="filter.filter_older_half_year()">半年以上更新なし</button>
          <button class="btn btn-success" @click="filter.filter_older_one_year()">1年以上更新なし</button>
          <button class="btn btn-success" @click="filter.filter_older_two_year()">2年以上更新なし</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from "../../const";
import Filter from "../../models/filter";

export default {
  name: "SongFilter",
  props: {
    filter: {
      type: Filter,
      required: true,
    }
  },
  data: () => ({
    show: false,
  }),
  methods: {
    config() {
      return config;
    },
    filter_visible() {
      this.show = !this.show;
    },
  },
}
</script>

<style scoped>
.filter button {
  margin: 5px;
  display: inline
}

.sidebar-list {
  margin-left: 10px;
}
</style>