<script setup lang="ts">
import { ref } from "vue"
import { useLoginStore } from '@/store/session'

const store = useLoginStore()

const message = ref("")
</script>

<template>
    <div id="play_calendar" v-if="store.userInfo">
        <h2>プレイカレンダー</h2>
        {{ message }}
    </div>
</template>

<style scoped>
#play_calendar {
    padding-top: 20px
}
</style>
