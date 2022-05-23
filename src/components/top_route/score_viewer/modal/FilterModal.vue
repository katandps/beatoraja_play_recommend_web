<template>
  <modal-base id="filter-modal" ref="modal_base">
    <template v-slot:header>
      <h2>譜面フィルター設定</h2>
    </template>
    <template v-slot:body>
      <div id="song_filter">
        <div class="filter">
          <h5>クリアタイプ</h5>
          <div class="form-group row align-items-center">
            <div
              v-for="lamp in config().LAMP_GRAPH_LIST"
              :key="lamp"
              class="form-control col-sm-3 text-nowrap"
            >
              <label :for="lamp" style="font-size: 0.9rem">
                <input
                  type="checkbox"
                  :id="lamp"
                  :value="lamp"
                  v-model="filter.visible_lamp[lamp]"
                />
                {{ config().LAMP_INDEX[lamp] }}
              </label>
            </div>
          </div>
          <button class="btn btn-danger" @click="filter.visible_reverse()">
            表示反転
          </button>
          <button
            class="btn btn-success"
            @click="filter.visible_all_lamp_type()"
          >
            全表示
          </button>
          <button
            class="btn btn-success"
            @click="filter.visible_not_full_combo()"
          >
            未FC
          </button>
          <button class="btn btn-success" @click="filter.visible_not_ex_hard()">
            未EXH
          </button>
          <button class="btn btn-success" @click="filter.visible_not_hard()">
            未HARD
          </button>
          <button class="btn btn-success" @click="filter.visible_not_easy()">
            未EASY
          </button>
        </div>

        <div class="filter">
          <h5>スコアランク</h5>
          <div class="form-group row align-items-center">
            <div
              v-for="rank in config().RANK_TYPE"
              :key="rank"
              class="form-control col-sm-3 text-nowrap"
            >
              <label :for="rank" style="font-size: 0.9rem">
                <input
                  type="checkbox"
                  :id="rank"
                  :value="rank"
                  v-model="filter.visible_rank[rank]"
                />
                {{ rank }}
              </label>
            </div>
          </div>
        </div>

        <div class="filter">
          <h5>更新日時</h5>
          <button class="btn btn-success" @click="filter.filter_all_term()">
            全期間
          </button>
          <button
            class="btn btn-success"
            @click="filter.filter_older_half_year()"
          >
            半年以上更新なし
          </button>
          <button
            class="btn btn-success"
            @click="filter.filter_older_one_year()"
          >
            1年以上更新なし
          </button>
          <button
            class="btn btn-success"
            @click="filter.filter_older_two_year()"
          >
            2年以上更新なし
          </button>
        </div>
      </div>
    </template>
  </modal-base>
</template>

<script>
import ModalBase from "./ModalBase"
import config from "../../../../const"

export default {
  name: "FilterModal",
  components: { ModalBase },
  methods: {
    showModal() {
      this.$refs.modal_base.show_modal()
    },
    config() {
      return config
    }
  },
  computed: {
    filter() {
      return this.$store.getters.filter
    }
  }
}
</script>

<style scoped>
.filter button {
  margin: 5px;
  display: inline;
}
</style>
