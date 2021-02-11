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
        <div class="td">{{ obj.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "../api";

export default {
  name: "UserList",
  props: {
    user_id: {
      type: Number,
    }
  },
  data:() => ({
    users: [],
  }),
  async mounted() {
      this.users = await Api.get_user_list(this.$store.getters.accessToken)
  }
}
</script>

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
  padding: .3rem;
  font-size: .8rem;
  border-bottom: 3px solid rgba(0, 0, 0, 0.1);
}

.td {
  display: table-cell;
  padding: .3rem;
  font-size: .8rem;
}

</style>