<script setup lang="ts">
import Api from '@/api';
import { useLoginStore } from '@/store/session';
import { ref } from 'vue';

// 状態を管理するref
const showConfirmDialog = ref(false);
const loginStore = useLoginStore()

// 確認ダイアログを表示するメソッド
const confirmAction = () => {
  showConfirmDialog.value = true;
};

// 操作を実行するメソッド
const executeAction = async () => {
  showConfirmDialog.value = false;
  await Api.reset_score(loginStore.accessToken).then(() => alert('Data was reset!'))
};

// 操作をキャンセルするメソッド
const cancelAction = () => {
  showConfirmDialog.value = false;
};

// --- methods ---
</script>

<template>
  <div id="data-reset">
    <h2>スコアデータのリセット</h2>
    <div v-if="!showConfirmDialog">
      <button @click="confirmAction" class="btn btn-danger text-nowrap">リセットする</button>
    </div>
    <div v-else class="overlay">
      <div class="dialog">
        <p>本当に実行しますか？この操作は取り消せません。</p>
        <button @click="executeAction" class="btn btn-danger text-nowrap">実行</button>
        <button @click="cancelAction" class="btn btn-info text-nowrap">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#profile-edit {
  padding-top: 20px
}
</style>
