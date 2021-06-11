<template>
  <div id="song_filter">
    <h6 class="sidebar-title" @click="filter_visible">表示フィルタ{{
        show ? "▼" : "▶"
      }}</h6>
    <transition>
      <div v-show="show" class="sidebar-body">
        <div class="filter">
          <h5>クリアタイプ</h5>
          <div class="form-group row align-items-center">
            <div v-for="lamp in config().LAMP_GRAPH_LIST" :key="lamp"
                 class="form-control col-sm-3 text-nowrap" >
              <label :for="lamp" style="font-size:0.9rem">
                <input type="checkbox" :id="lamp" :value="lamp"
                       v-model="model.filter.visible_lamp[lamp]">
                {{ config().LAMP_INDEX[lamp] }}
              </label>
            </div>
          </div>
          <button class="btn btn-danger"
                  @click="model.filter.visible_reverse()">表示反転
          </button>
          <button class="btn btn-success"
                  @click="model.filter.visible_all_lamp_type()">全表示
          </button>
          <button class="btn btn-success"
                  @click="model.filter.visible_not_full_combo()">未FC
          </button>
          <button class="btn btn-success"
                  @click="model.filter.visible_not_ex_hard()">未EXH
          </button>
          <button class="btn btn-success"
                  @click="model.filter.visible_not_hard()">未HARD
          </button>
          <button class="btn btn-success"
                  @click="model.filter.visible_not_easy()">未EASY
          </button>
        </div>

        <div class="filter">
          <h5>スコアランク</h5>
          <div class="form-group row align-items-center">
            <div v-for="rank in config().RANK_TYPE" :key="rank"
                 class="form-control col-sm-3 text-nowrap">
              <label :for="rank" style="font-size:0.9rem">
                <input type="checkbox" :id="rank" :value="rank"
                       v-model="model.filter.visible_rank[rank]">
                {{ rank }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter">
          <h5>更新日時</h5>
          <button class="btn btn-success"
                  @click="model.filter.filter_all_term()">全期間
          </button>
          <button class="btn btn-success"
                  @click="model.filter.filter_older_half_year()">半年以上更新なし
          </button>
          <button class="btn btn-success"
                  @click="model.filter.filter_older_one_year()">1年以上更新なし
          </button>
          <button class="btn btn-success"
                  @click="model.filter.filter_older_two_year()">2年以上更新なし
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from "../../../../const";
import Model from "../../../../models/model";

export default {
  name: "SongFilterController",
  props: {
    model: {
      type: Model,
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