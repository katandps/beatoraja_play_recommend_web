<script setup lang="ts">
import SongDetail, { Log } from "@/models/song_detail"
import { computed, ref } from "vue"
import ModalBase, { IModalBase } from "./ModalBase.vue"
import LogChart from "./LogChart.vue";

export interface ISongModal {
  showModal: (song: SongDetail, date: string, logs: Log[]) => void
}

// --- refs ---
const modal_base = ref<IModalBase>()

// --- data ---
const song = ref<SongDetail>()
const date = ref<string>()
const logs = ref<Log[]>()

// --- methods ---
const showModal = (s: SongDetail, d: string, l: Log[]) => {
  song.value = s
  date.value = d
  logs.value = l
  modal_base.value?.showModal()
}

// --- computed ---
const viewer_url = computed(() => "http://www.ribbit.xyz/bms/score/view?md5=" + song.value?.md5)
const mocha_url = computed(() => "https://mocha-repository.info/song.php?sha256=" + song.value?.sha256)
const minir_url = computed(() => "https://www.gaftalk.com/minir/#/viewer/song/" + song.value?.sha256 + "/" + song.value?.mode)
const lr2ir_url = computed(() => "http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=" + song.value?.md5)

// --- expose ---
defineExpose({ showModal })
</script>

<template>
  <modal-base id="song-modal" ref="modal_base">
    <template v-slot:header>
      {{ song?.get("level") }} {{ song?.get("title") }}
    </template>
    <template v-slot:body>
      <div id="stats">
        <h3>プレイ情報</h3>
        <div class="row">
          <div class="card col-sm-4" :class="'bg-' + song?.get('clear_type')">
            <div class="header">クリアタイプ</div>
            <div class="body"><span v-html="song?.get('clear_type')" /></div>
          </div>
          <div class="card col-sm-4" :class="'bg-' + song?.get('score_rank')">
            <div class="header">スコアランク</div>
            <div class="body"><span v-html="song?.get('score_rank')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">最終更新日</div>
            <div class="body"><span v-html="song?.get('date')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア</div>
            <div class="body"><span v-html="song?.get('score')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコアレート</div>
            <div class="body"><span v-html="song?.get('rate')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント</div>
            <div class="body"><span v-html="song?.get('bp')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">コンボ</div>
            <div class="body"><span v-html="song?.get('combo')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">プレイ回数</div>
            <div class="body"><span v-html="song?.get('play')" /></div>
          </div>
        </div>
      </div>
      <div id="song">
        <h3>曲情報</h3>
        <div class="row">
          <div class="card col-sm-4">
            <div class="header">ノーツ</div>
            <div class="body"><span v-html="song?.get('notes')"></span></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">Ranking</div>
            <div class="body">
              <router-link :to="{
                path: '/song',
                query: Object.assign({}, $route.query, {
                  sha256: song?.sha256,
                  date: date
                })
              }">
                IRへ移動
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div id="graph" v-if="logs && song">
        <h3>遷移</h3>
        <log-chart :logs="logs" :song="song" />
      </div>
      <div id="links">
        <h3>外部リンク</h3>
        <div class="row align-items-center">
          <div class="card col-6">
            <a :href="viewer_url" target="_blank">BMS Score Viewer</a>
          </div>
          <div class="card col-6">
            <a :href="mocha_url" target="_blank">Mocha Repository</a>
          </div>
          <div class="card col-6">
            <a :href="minir_url" target="_blank">MinIR for Beatoraja</a>
          </div>
          <div class="card col-6">
            <a :href="lr2ir_url" target="_blank">Lunatic Rave 2 Internet Ranking</a>
          </div>
        </div>
      </div>
    </template>
  </modal-base>
</template>


