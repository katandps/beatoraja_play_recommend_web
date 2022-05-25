<script setup lang="ts">
import { ref } from "vue"

export interface IModalBase {
  showModal: () => void
  closeModal: () => void
}
// --- data ---
const show = ref(false)

// --- methods ---
const showModal = () => (show.value = true)
const closeModal = () => (show.value = false)

// --- expose ---
defineExpose({ showModal, closeModal })
</script>

<template>
  <div id="modal-area">
    <transition name="fade">
      <div class="modal-area" v-if="show">
        <div id="modal-bg" class="modal-bg" @click="closeModal"></div>
        <div class="modal-wrapper">
          <div class="modal-contents">
            <div class="modal-header">
              <slot name="header">Modal-header</slot>
            </div>
            <div class="modal-body">
              <slot name="body">Modal-body</slot>
            </div>
          </div>
          <div id="close-modal" class="close-modal" @click="closeModal">
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-area {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.95;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
