<template>
  <div id="my-page">
    <h1>マイページ</h1>
    <profile-edit/>
    <data-uploader/>
  </div>
</template>

<script>
import ProfileEdit from "./my_page/ProfileEdit"
import DataUploader from "./my_page/DataUploader"

export default {
  name: "MyPage",
  components: {DataUploader, ProfileEdit}
}
</script>

<style scoped>
#my-page {
  padding-top: 20px;
}
</style>