<template>
  <div id="toolHeader">
    <ul class="dis-flex operators">
      <li class="operator-item">文件</li>
      <li class="operator-item">设置</li>
      <li class="operator-item" @click="downloadImage">下载</li>
      <li class="operator-item" @click="downloadImageGIF">下载GIF</li>
      <li class="operator-item" @click="undo">撤销</li>
      <li class="operator-item" @click="redo">还原</li>
      <li class="operator-item">全屏</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useDoState } from "../composables/useDoState";
import { useDownload } from "../composables/useDownload";
export default {
  name: "ToolHeader",
  setup() {
    const { redo, undo } = useDoState();
    const { downloadImage, downloadImageGIF } = useDownload();
    return {
      redo,
      undo,
      downloadImage,
      downloadImageGIF
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
