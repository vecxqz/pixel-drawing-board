<template>
  <div class="aside-container">
    <div class="avatar-container">
      <img src="@/assets/avatar.png" alt="" srcset="" />
    </div>
    <div class="operate-group">
      <div class="operate-item" @click="createProject">
        创建新工程
      </div>
    </div>
  </div>
</template>

<script ts="lang">
export default {
  name: "DashboardAside",
  setup() {
    function createProject() {
      window.open("/draw");
    }
    return { createProject };
  }
};
</script>

<style lang="scss" scoped>
.aside-container {
  padding: 20px 0;
}
.avatar-container {
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    box-shadow: 3px 1px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
.operate-item {
  padding: 15px;
  margin: 20px 0;
  text-align: center;
  cursor: pointer;
  box-shadow: 3px 1px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
