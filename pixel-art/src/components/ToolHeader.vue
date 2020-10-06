<template>
  <div id="toolHeader">
    <ul class="dis-flex operators">
      <li class="operator-item">FILE</li>
      <li class="operator-item">SETTINGS</li>
      <li class="operator-item">DOWNLOAD</li>
      <li class="operator-item">UNDO</li>
      <li class="operator-item">REDO</li>
      <li class="operator-item">FULL SCREEN</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ToolHeader"
};
</script>

<style lang="scss" scoped>
#toolHeader {
  height: 45px;
  color: #fff;
  background-color: #333;
}
.dis-flex {
  display: flex;
}
.operators {
  height: 100%;
  font-size: 12px;
}
.operator-item {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.075);
  }
}
</style>
