<template>
  <div id="toolHeader">
    <ul class="dis-flex operators">
      <li class="operator-item">FILE</li>
      <li class="operator-item">SETTINGS</li>
      <li class="operator-item">DOWNLOAD</li>
      <li class="operator-item" @click="undo">UNDO</li>
      <li class="operator-item" @click="redo">REDO</li>
      <li class="operator-item">FULL SCREEN</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useDoState } from "../composables/useDoState";
export default {
  name: "ToolHeader",
  setup() {
    const { redo, undo } = useDoState();
    return {
      redo,
      undo
    };
  }
};
</script>

<style lang="scss" scoped>
#toolHeader {
  height: 40px;
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
