<script setup lang="ts">
import ModalBase, { IModalBase } from "./ModalBase.vue"

import { ref, onMounted, computed } from "vue"
import Api from "../../../../api"
import { useLoginStore } from "@/store/session"

export interface IModalUserSelect {
  showModal: () => void
  closeModal: () => void
}

const store = useLoginStore()

defineProps({
  rival_mode: { type: Boolean }
})

interface User {
  id: number
  name: string
}

const emits = defineEmits(["setUser"])

onMounted(async () => {
  Api.get_user_list(accessToken.value).then((u: User[]) => {
    users.value = u
    users.value.sort((a, b) => a.id - b.id)
  })
})

// --- ref ---
const modal_base = ref<IModalBase>()

// --- data ---
const users = ref<User[]>([])
const date = ref(new Date())
const searchText = ref("")

// --- computed ---
const accessToken = computed(() => store.accessToken)
const loginUserName = computed(() => store.userInfo?.name || "")
const hasKeyword = computed(() => searchText.value.trim().length > 0)
const selectedUserHistory = computed(() => store.selectedUserHistory)
const filteredUsers = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  if (!keyword) {
    return []
  }
  return users.value
    .filter((u) => u.name.toLowerCase().includes(keyword))
    .slice(0, 20)
})

// --- methods ---
const showModal = () => {
  modal_base.value?.showModal()
}
const closeModal = () => modal_base.value?.closeModal()
const setUser = (user_id: number, user_name?: string) => {
  const name = user_name || users.value.find((u) => u.id === user_id)?.name
  if (name) {
    store.addSelectedUserHistory({ id: user_id, name })
  }
  emits("setUser", user_id, date.value)
}
const setLoginUser = async () => {
  if (store.is_login() === false) {
    return
  }
  setUser(store.userInfo?.user_id || 0, store.userInfo?.name || "")
}
const resetDate = () => {
  date.value = new Date()
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
      <div class="mt-2 mb-3">
        <button class="btn btn-outline-primary" :disabled="!store.is_login()" @click="setLoginUser">
          ログイン中ユーザを選択
          <span v-if="loginUserName">({{ loginUserName }})</span>
        </button>
      </div>

      <div v-if="selectedUserHistory.length > 0" class="mb-3">
        <div class="small text-muted mb-1">最近選択したユーザ</div>
        <div class="row">
          <div class="btn btn-outline-secondary col-sm-4" v-for="obj in selectedUserHistory" :key="`history-${obj.id}`"
            @click="setUser(obj.id, obj.name)">
            {{ obj.name }}
          </div>
        </div>
      </div>

      <div class="mb-2">
        <input v-model="searchText" type="text" class="form-control" placeholder="ユーザ名を部分一致で検索" />
      </div>

      <div v-if="!hasKeyword" class="text-muted">
        ユーザ名を入力すると候補を表示します。
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-muted">
        該当するユーザが見つかりません。
      </div>

      <div v-else class="row">
        <div class="btn btn-outline-secondary col-sm-4" v-for="obj in filteredUsers" :key="obj.id"
          @click="setUser(obj.id, obj.name)">
          {{ obj.name }}
        </div>
      </div>

    </template>
  </ModalBase>
</template>
