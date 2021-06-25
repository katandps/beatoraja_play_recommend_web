<template>
  <div id="modalArea" @click="close_modal">
    <transition name="fade">
      <div class="modalArea" v-if="show">
        <div id="modalBg" class="modalBg"></div>
        <div class="modalWrapper">
          <div class="modalContents">
            <slot></slot>
          </div>
          <div id="closeModal" class="closeModal">
            ×
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "GraphModal",
  data: () => ({
    show: false
  }),
  methods: {
    show_modal() {
      this.show = true
    },
    close_modal() {
      this.show = false
    }
  },
}
</script>

<style scoped>

/* モーダルCSS */
.modalArea {
  position: fixed;
  z-index: 10; /*サイトによってここの数値は調整 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.modalBg {
  width: 100%;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.9);
}

.modalWrapper {
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

.closeModal {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>