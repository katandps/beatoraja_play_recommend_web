<script setup lang="ts">
import { ref } from "vue"
import { useLoginStore } from '@/store/session'

const store = useLoginStore()

const message = ref("")

// --- methods ---
const change_name = async () => {
  message.value = await store.change_name()
}
const change_visibility = async () => {
  message.value = await store.change_visibility()
}
</script>

<template>
  <div id="profile-edit" v-if="store.userInfo">
    <h2>プロフィール</h2>
    <div class="input-group">
      <div class="input-group-prepend">
        <label for="name-input" class="btn btn-outline-secondary">名前</label>
      </div>
      <input id="name-input" class="form-control" v-model="store.userInfo.name" />
      <div class="input-group-append">
        <label class="btn btn-success text-nowrap" @click="change_name">
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
      <input id="visibility-input" class="btn-check" type="checkbox" v-model="store.userInfo.visibility"
        autocomplete="off" />
      <label class="btn btn-outline-primary form-control" for="visibility-input">
        <template v-if="store.userInfo.visibility">
          表示
        </template>
        <template v-else>
          非表示
        </template>
      </label>
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
  padding-top: 20px
}
</style>
