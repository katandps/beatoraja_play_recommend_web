<template>
  <modal-base id="rival-modal" ref="modal_base">
    <template v-slot:header>
      {{ song.get('level') }}
      {{ song.get('title') }}
    </template>
    <template v-slot:body>
      <div id="win-lose">
        <h3>勝敗</h3>
        <div class="row">
          <div class="card col-sm-4">
            <div class="header">クリア比較</div>
            <div class="body"><span v-html="song.get('clear_diff_rival')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア比較</div>
            <div class="body"><span v-html="song.get('score_diff_rival')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント比較</div>
            <div class="body"><span v-html="song.get('bp_diff_rival')" /></div>
          </div>
        </div>
      </div>
      <div id="rival-stats">
        <h3>ライバル情報</h3>
        <div class="row">
          <div class="card col-sm-4" :class="'bg-' + song.get('rival_clear_type')">
            <div class="header">クリアタイプ</div>
            <div class="body"><span v-html="song.get('rival_clear_type')"/></div>
          </div>
          <div class="card col-sm-4" :class="'bg-' + song.get('rival_rank')">
            <div class="header">スコアランク</div>
            <div class="body"><span v-html="song.get('rival_rank')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">最終更新日</div>
            <div class="body"><span v-html="song.get('rival_date')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア</div>
            <div class="body"><span v-html="song.get('rival_score')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコアレート</div>
            <div class="body"><span v-html="song.get('rival_rate')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント</div>
            <div class="body"><span v-html="song.get('rival_bp')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">コンボ</div>
            <div class="body"><span v-html="song.get('rival_combo')"/></div>
          </div>
        </div>
      </div>
      <div id="stats">
        <h3>プレイ情報</h3>
        <div class="row">
          <div class="card col-sm-4" :class="'bg-' + song.get('clear_type')">
            <div class="header">クリアタイプ</div>
            <div class="body"><span v-html="song.get('clear_type')"/></div>
          </div>
          <div class="card col-sm-4" :class="'bg-' + song.get('score_rank')">
            <div class="header">スコアランク</div>
            <div class="body"><span v-html="song.get('score_rank')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">最終更新日</div>
            <div class="body"><span v-html="song.get('date')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア</div>
            <div class="body"><span v-html="song.get('score')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコアレート</div>
            <div class="body"><span v-html="song.get('rate')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント</div>
            <div class="body"><span v-html="song.get('bp')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">コンボ</div>
            <div class="body"><span v-html="song.get('combo')"/></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">プレイ回数</div>
            <div class="body"><span v-html="song.get('play')"/></div>
          </div>
        </div>
      </div>
      <div id="song">
        <h3>曲情報</h3>
        <div class="row">
          <div class="card col-sm-4">
            <div class="header">ノーツ</div>
            <div class="body"><span v-html="song.get('notes')"></span></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">Ranking</div>
            <div class="body">
              <router-link
                  :to="{path:'/song', query: Object.assign({}, $route.query, {sha256: song.sha256, date: date})}">
                IRへ移動
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div id="links">
        外部リンク
        <div class="row align-items-center">
          <div class="card col-4">
            BMS Score Viewer
            <span v-html="song.get('viewer')"/>
          </div>
          <div class="card col-4">
            Mocha Repository
            <span v-html="song.get('mocha')"/>
          </div>
          <div class="card col-4">
            MinIR for Beatoraja
            <span v-html="song.get('minir')"/>
          </div>
        </div>
      </div>
    </template>
  </modal-base>
</template>

<script>
import ModalBase from './ModalBase'

export default {
  name: "RivalModal",
  components: {ModalBase},
  data: () => ({
    song: null
  }),
  methods: {
    /**
     * @param {SongDetail} song
     */
    showModal(song, date) {
      this.$refs.modal_base.showModal()
      this.song = song
      this.date = date
    },    
  },
}
</script>

<style scoped></style>