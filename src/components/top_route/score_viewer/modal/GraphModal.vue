<template>
  <div id="modal-area">
    <transition name="fade">
      <div class="modal-area" v-if="show">
        <div id="modal-bg" class="modal-bg" @click="close_modal"></div>
        <div class="modal-wrapper">
          <div class="modal-contents">
            <div class="modal-header">
              {{ title }}
            </div>
            <div class="modal-body">
              <ul>
                <li v-for="(text, index) in text" :key="index">{{ text }}</li>
              </ul>
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
export default {
  name: "GraphModal",
  data: () => ({
    show: false,
    text: "",
    title: ""
  }),
  methods: {
    show_modal(title, text) {
      this.text = text
      this.title = title
      this.show = true
    },
    close_modal() {
      this.show = false
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

.modal-body {
  padding: 5px 25px;
  font-size: 0.9rem;
}

.modal-body li {
  text-align: left;
}

.modal-header {
  padding: 5px 25px;
  font-size: 1.4rem;
  border-bottom: 1px solid #ddd;
}
</style>