<script setup>
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import Api from "../../api"

const store = useStore()

// --- data ---
const users = ref([])

// --- computed ---
const accessToken = computed(() => store.getters.accessToken)

onMounted(() => {
  Api.get_user_list(accessToken).then((u) => {
    users.value = u
    users.value.sort((a, b) => a.id - b.id)
  })
})
</script>

<template>
  <div id="user-list">
    <h2>ユーザーリスト</h2>
    プロフィールで表示をオンにしているユーザーのリストです。
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="th">ID</div>
          <div class="th">Name</div>
        </div>
      </div>
      <div class="tr" v-for="obj in users" :key="obj.id">
        <div class="td">{{ obj.id }}</div>
        <div class="td">
          <router-link :to="'/view/?user_id=' + obj.id">{{
            obj.name
          }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#user-list {
  padding-top: 20px;
}

.table {
  display: table;
  table-layout: auto;
}

.thead {
  display: table-header-group;
}

.tbody {
  display: table-row-group;
}

.tr {
  display: table-row;
}

.th {
  display: table-cell;
  font-weight: bold;
  position: sticky;
  top: -1px;
  z-index: 3;
  padding: 0.3rem;
  font-size: 0.8rem;
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
}

.td {
  display: table-cell;
  padding: 0.3rem;
  font-size: 0.8rem;
}
</style>
