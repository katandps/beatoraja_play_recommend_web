<script setup>
import ModalBase from "./ModalBase.vue"
import DateSelector from "../selector/DateSelector.vue"

import { ref, onMounted, computed } from "vue"
import Api from "../../../../api.ts"
import { useStore } from "vuex"

const store = useStore()

defineProps({
  user_id: { type: Number, require: false }
})

const emits = defineEmits(["setUser"])

onMounted(() => {
  Api.get_user_list(accessToken).then((u) => {
    users.value = u
    users.value.sort((a, b) => a.id - b.id)
  })
})

// --- ref ---
const modal_base = ref(null)

// --- data ---
const users = ref([])
const date = ref(new Date(new Date().setHours(0, 0, 0, 0)))

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)

// --- methods ---
const showModal = () => modal_base.value.show_modal()
const closeModal = () => modal_base.value.close_modal()
const setUser = (user_id) => {
  emits("setUser", user_id, date.value)
}
const set_date = (d) => (date.value = d)

// --- expose ---
defineExpose({ showModal, closeModal })
</script>

<template>
  <ModalBase ref="modal_base">
    <template v-slot:header>
      <h2>プレイ状況の取得</h2>
    </template>
    <template v-slot:body>
      <h3>日付の選択</h3>
      指定した当時のプレイ状況を再現します。<br />LR2からインポートしたデータや、プレイ回数などは再現されません。
      <DateSelector :date="date" @setDate="set_date" />
      <hr />
      <h3>プレイヤーの選択</h3>
      プロフィールを公開しているプレイヤーのみ表示されます。<br />
      非表示の方はログインすることで自分のデータが閲覧できます。

      <div class="row">
        <div
          class="btn btn-outline-secondary col-sm-4"
          v-for="obj in users"
          :key="obj.id"
          @click="setUser(obj.id)"
        >
          {{ obj.name }}
        </div>
      </div>
    </template>
  </ModalBase>
</template>
