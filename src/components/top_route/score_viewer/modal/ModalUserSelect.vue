<script setup lang="ts">
import ModalBase, { IModalBase } from "./ModalBase.vue"

import { ref, onMounted, computed } from "vue"
import Api from "../../../../api"
import { useStore } from "vuex"

export interface IModalUserSelect {
  showModal: () => void
  closeModal: () => void
}

const store = useStore()

defineProps({
  user_id: { type: Number, require: false },
  rival_mode: { type: Boolean }
})

interface User {
  id: number
  name: string
}

const emits = defineEmits(["setUser"])

onMounted(() => {
  Api.get_user_list(accessToken.value).then((u: User[]) => {
    users.value = u
    users.value.sort((a, b) => a.id - b.id)
  })
})

// --- ref ---
const modal_base = ref<IModalBase>()

// --- data ---
const users = ref<User[]>([])
const date = ref(new Date(new Date().setHours(0, 0, 0, 0)))

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)

// --- methods ---
const showModal = () => {
  modal_base.value?.showModal()
}
const closeModal = () => modal_base.value?.closeModal()
const setUser = (user_id: number) => {
  emits("setUser", user_id, date.value)
}
const resetDate = () => {
  date.value = new Date(new Date().setHours(0, 0, 0, 0))
}
// --- expose ---
defineExpose({ showModal, closeModal })
</script>

<template>
  <ModalBase ref="modal_base">
    <template v-slot:header>
      <h2>{{ rival_mode ? "ライバルの" : "" }}プレイ状況の取得</h2>
    </template>
    <template v-slot:body>
      <h3>日付の選択</h3>
      指定した当時のプレイ状況を再現します。<br />LR2からインポートしたデータや、プレイ回数などは再現されません。
      <div class="align-items-center row">
        <DatePicker v-model="date" class="col-sm-10" format="yyyy-MM-dd" :enableTimePicker="false" />
        <label @click="resetDate" class="btn btn-danger col-sm-2">
          <font-awesome-icon :icon="['fas', 'undo']" />
        </label>
      </div>
      <hr />
      <h3>プレイヤーの選択</h3>
      プロフィールを公開しているプレイヤーのみ表示されます。<br />
      非表示の方はログインすることで自分のデータが閲覧できます。

      <div class="row">
        <div class="btn btn-outline-secondary col-sm-4" v-for="obj in users" :key="obj.id" @click="setUser(obj.id)">
          {{ obj.name }}
        </div>
      </div>
    </template>
  </ModalBase>
</template>
