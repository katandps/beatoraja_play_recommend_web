<template>
  <div id="DetailColumns">
    <h6 class="sidebar-title" @click="filter_visible">
      表示カラム{{ show ? "▼" : "▶" }}
    </h6>
    <transition>
      <div v-show="show" class="form-group row align-items-center">
        <div v-for="obj in column_list" :key="obj.key"
             class="form-control col-sm-3 text-nowrap">
          <label style="font-size:0.9rem">
            <input type="checkbox" :id="obj.key"
                   v-model="columns[obj.key]">
            {{ obj.name }}
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from '../../../../const.js'
import Columns from "../../../../models/columns"


const DETAIL_COLUMNS= [
    {key: 'clear', name: 'クリア', title: ' ', class: 'clear'},
    {key: 'clear_date', name: 'クリア更新日', title: 'Date(clear)', class: 'date'},
    {key: 'clear_before', name: '更新前クリア', title: ' ', class: 'clear'},
    {key: 'level', name: '難易度', title: 'Lv', class: 'level'},
    {key: 'title', name: '曲名', title: 'Title', class: 'title'},
    {key: 'score_rank', name: 'スコアランク', title:'Rank', class: 'rank'},
    {key: 'score_rank2', name: '細分化ランク', title:'Rank', class: 'rank'},
    {key: 'rate', name: 'スコア%', title: 'Rate', class: 'rate'},
    {key: 'score', name: 'EXスコア', title: 'Ex/Max', class: 'score'},
    {key: 'score_date', name: 'スコア更新日', title: 'Date(score)', class: 'date'},
    {key: 'score_before', name: '更新前スコア', title: 'Ex(old)', class: 'score'},
    {key: 'bp', name: 'ミスカウント', title: 'BP', class: 'bp'},
    {key: 'bp_date', name: 'ミスカウント更新日', title: 'Date(BP)', class: 'date'},
    {key: 'bp_before', name: '更新前ミスカウント', title: 'BP(old)', class: 'bp'},
    {key: 'combo', name: '最高コンボ', title: 'Combo', class: 'combo'},
    {key: 'play', name: 'プレイ回数', title: 'Play', class: 'play'},
    {key: 'date', name: '更新日', title: 'Date', class: 'date'}
]

export default {
  name: "DetailColumns",
  data: () => ({
    show: false,
    columns: new Columns()
  }),
  computed: {
    column_list() {
      return DETAIL_COLUMNS.filter(c => c.key !== "title")
    },
  },
  beforeMount() {
    this.columns = this.$store.state.filter.columns
  },
  methods: {
    config() {
      return config;
    },
    filter_visible() {
      this.show = !this.show;
    },
  },
  watch: {
    columns: {
      deep: true,
      handler() {
        this.$store.commit('setColumns', this.columns)
      }
    }
  }
}
</script>