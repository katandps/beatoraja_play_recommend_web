<template>
  <modal-base id="recent-modal" ref="modal_base">
    <template v-slot:header>
      {{ song.get("level") }} {{ song.get("title") }}
    </template>
    <template v-slot:body>
      <div id="update">
        <h3>更新内容</h3>
        <div class="row">
          <div class="card col-sm-4">
            <div class="header">クリア更新</div>
            <div class="body">
              <span
                v-if="
                  song.clear_updated_at.split('T')[0] ===
                  song.updated_at.split('T')[0]
                "
              >
                {{ config().LAMP_INDEX[song.clear_type_before] }}
                <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" />
                {{ config().LAMP_INDEX[song.clear_type] }}
              </span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア更新</div>
            <div class="body">
              <span
                v-if="
                  song.score_updated_at.split('T')[0] ===
                  song.updated_at.split('T')[0]
                "
              >
                +{{ song.score - song.score_before }} ({{ song.score }})
              </span>
              <span v-else>{{ song.score }}</span>
            </div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント更新</div>
            <div class="body">
              <span
                v-if="
                  song.min_bp_updated_at.split('T')[0] ===
                  song.updated_at.split('T')[0]
                "
              >
                <span v-if="song.min_bp_before !== -1">{{
                  song.min_bp - song.min_bp_before
                }}</span>
                <span v-else>new</span>
                ({{ song.min_bp }})
              </span>
              <span v-else>{{ song.min_bp }}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="stats">
        <h3>プレイ情報</h3>
        <div class="row">
          <div class="card col-sm-4" :class="'bg-' + song.get('clear_type')">
            <div class="header">クリアタイプ</div>
            <div class="body"><span v-html="song.get('clear_type')" /></div>
          </div>
          <div class="card col-sm-4" :class="'bg-' + song.get('score_rank')">
            <div class="header">スコアランク</div>
            <div class="body"><span v-html="song.get('score_rank')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">最終更新日</div>
            <div class="body"><span v-html="song.get('date')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコア</div>
            <div class="body"><span v-html="song.get('score')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">スコアレート</div>
            <div class="body"><span v-html="song.get('rate')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">ミスカウント</div>
            <div class="body"><span v-html="song.get('bp')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">コンボ</div>
            <div class="body"><span v-html="song.get('combo')" /></div>
          </div>
          <div class="card col-sm-4">
            <div class="header">プレイ回数</div>
            <div class="body"><span v-html="song.get('play')" /></div>
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
                :to="{
                  path: '/song',
                  query: Object.assign({}, $route.query, {
                    sha256: song.sha256,
                    date: date
                  })
                }"
              >
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
            <span v-html="song.get('viewer')" />
          </div>
          <div class="card col-4">
            Mocha Repository
            <span v-html="song.get('mocha')" />
          </div>
          <div class="card col-4">
            MinIR for Beatoraja
            <span v-html="song.get('minir')" />
          </div>
        </div>
      </div>
    </template>
  </modal-base>
</template>

<script>
import config from "../../../../const"
import ModalBase from "./ModalBase"

export default {
  name: "RecentModal",
  components: { ModalBase },
  data: () => ({
    song: null
  }),
  methods: {
    /**
     * @param {SongDetail} song
     */
    show_modal(song, date) {
      this.$refs.modal_base.show_modal()
      this.song = song
      this.date = date
    },
    config() {
      return config
    }
  }
}
</script>

<style scoped></style>
