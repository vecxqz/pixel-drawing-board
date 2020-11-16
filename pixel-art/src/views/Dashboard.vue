<template>
  <el-container class="dashboard-container">
    <el-header class="dashboard-header"></el-header>
    <el-container>
      <el-aside class="dashboard-aside">
        <DashboardAside />
      </el-aside>
      <el-main class="dashboard-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import DashboardAside from "./Dashboard/Aside.vue";
export default {
  components: {
    DashboardAside
  },
  setup() {}
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100vh;
  overflow: hidden;
}
.dashboard-header {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.dashboard-aside {
  height: calc(100vh - 60px);
  box-shadow: 3px 7px 12px 0 rgba(0, 0, 0, 0.1);
}
.dashboard-main {
  height: calc(100vh - 60px);
}
</style>
