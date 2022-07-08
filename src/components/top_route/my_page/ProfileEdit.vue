<script setup lang="ts">
import Api from "../../../api"
import * as log from "loglevel"
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore()

const name = ref(store.getters.userInfo.name)
const message = ref("")
const visibility = ref(store.getters.userInfo.visibility)
const lock = ref(false)

// --- computed ---
const disabled = computed(() => {
  return (
    lock.value ||
    name.value === "" ||
    !store.getters.userInfo ||
    store.getters.userInfo.name === name.value
  )
})
const token = computed(() => store.getters.accessToken)

// --- methods ---
const change_name = async () => {
  if (disabled.value) {
    return
  }
  lock.value = true
  await Api.change_user_name(token.value, name.value)
    .then((res) => {
      log.debug(res)
      store.commit("setUserInfo", res)
      message.value = "" + name.value + "に更新しました。"
      lock.value = false
    })
    .catch(() => {
      message.value = "更新に失敗しました。"
    })
}
const change_visibility = async () => {
  if (visibility.value === store.getters.userInfo.visibility) {
    return
  }
  const to = visibility.value
  await Api.change_visibility(token.value, to)
    .then((res) => {
      log.debug(res)
      store.commit("setUserInfo", res)
      message.value = to
        ? "プロフィールを表示状態にしました。"
        : "プロフィールを非表示状態にしました。"
    })
    .catch(() => {
      message.value = "更新に失敗しました。"
    })
}
</script>

<template>
  <div id="profile-edit">
    <h2>プロフィール</h2>
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="name-input" class="btn btn-outline-secondary"> 名前</label>
      </div>
      <input id="name-input" class="form-control" v-model="name" />
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="change_name" :class="disabled ? 'disabled' : ''"
          :disabled="disabled">
          変更を反映
        </label>
      </div>
    </div>
    <hr />
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="visibility-input" class="btn btn-outline-secondary">
          プロフィールの表示
          <font-awesome-icon :icon="['fas', 'wrench']" />
        </label>
      </div>
      <input id="visibility-input" class="form-control" type="checkbox" v-model="visibility" />
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="change_visibility">
          変更を反映
        </label>
      </div>
    </div>
    <br />
    {{ message }}
  </div>
</template>

<style scoped>
#profile-edit {
  padding-top: 20px;
}
</style>
