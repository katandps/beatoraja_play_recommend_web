<template>
  <div id="modal-area">
    <transition name="fade">
      <div class="modal-area" v-if="show">
        <div id="modal-bg" class="modal-bg" @click="close_modal"></div>
        <div class="modal-wrapper">
          <div class="modal-contents">
            <div class="modal-header">
              {{ song.get('level') }} {{ song.get('title') }}
            </div>
            <div class="modal-body">
              <div id="update">
                更新内容
                <div class="row">
                  <div class="card col-sm-4">
                    <div class="header">クリア更新</div>
                    <div class="body">
                      <span v-if="song.clear_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                        {{ config().LAMP_INDEX[song.clear_type_before] }}
                        <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']"/>
                        {{ config().LAMP_INDEX[song.clear_type] }}
                      </span>
                      <span v-else>-</span>
                    </div>
                  </div>
                  <div class="card col-sm-4">
                    <div class="header">スコア更新</div>
                    <div class="body">
                      <span v-if="song.score_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                      +{{ song.score - song.score_before }} ({{ song.score }})
                      </span>
                      <span v-else>{{ song.score }}</span>
                    </div>
                  </div>
                  <div class="card col-sm-4">
                    <div class="header">ミスカウント更新</div>
                    <div class="body">
                      <span v-if="song.min_bp_updated_at.split('T')[0] === song.updated_at.split('T')[0]">
                        <span v-if="song.min_bp_before !== -1">{{song.min_bp - song.min_bp_before }}</span>
                        <span v-else>new</span>
                        ({{ song.min_bp }})
                      </span>
                      <span v-else>{{ song.min_bp }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="stats">
                プレイ情報
                <div class="row">
                  <div class="card col-sm-4" :class="'bg-' + song.get('clear_type')">
                    <div class="header">クリアタイプ</div>
                    <div class="body"><span v-html="song.get('clear_type')"/></div>
                  </div>
                  <div class="card col-sm-4" :class="'bg-' + song.get('rank')">
                    <div class="header">スコアランク</div>
                    <div class="body"><span v-html="song.get('rank')"/></div>
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
                曲情報
                <div class="row">
                  <div class="card col-sm-4">
                    <div class="header">ノーツ</div>
                    <div class="body"><span v-html="song.get('notes')"></span></div>
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
            </div>
          </div>
          <div id="close-modal" class="close-modal" @click="close_modal">
            ×
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import config from "../../../../const.js"

export default {
  name: "RecentModal",
  data: () => ({
    show: false,
    song: null
  }),
  methods: {
    /**
     * @param {SongDetail} song
     */
    show_modal(song) {
      this.show = true
      this.song = song
    },
    close_modal() {
      this.show = false
    },
    config() {
      return config
    }
  },
}
</script>

<style scoped>
.modal-area {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.modal-bg {
  width: 100%;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.9);
}

.modal-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 800px;
  height: 90%;
  overflow: auto;
  padding: 10px 30px;
  background-color: #fff;
}

.close-modal {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>