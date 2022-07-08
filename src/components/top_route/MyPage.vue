<script setup lang="ts">
import ProfileEdit from "./my_page/ProfileEdit.vue"
import DataUploader from "./my_page/DataUploader.vue"
</script>

<template>
  <div id="my-page">
    <h1>マイページ</h1>
    <profile-edit />
    <data-uploader />
  </div>
</template>

<style scoped>
#my-page {
  padding-top: 20px;
}
</style>