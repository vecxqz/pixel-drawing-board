<template>
  <div>operate Header</div>
  <div class="dis-flex">
    <div class="area-tool">
      <ToolBar />
    </div>
    <div class="area-canvas">
      <PixleCanvas />
    </div>
    <div class="area-attribute">
      attribute area
    </div>
  </div>
  <div>canvas animation preview</div>
</template>
<script>
import PixleCanvas from "@/components/Canvas.vue";
import ToolBar from "@/components/ToolBar.vue";
export default {
  components: {
    PixleCanvas,
    ToolBar
  }
};
</script>

<style lang="scss" scoped>
.dis-flex {
  display: flex;
}
.area {
  &-tool {
    flex: 0;
    min-width: 100px;
  }
  &-attribute {
    flex: 0;
    min-width: 230px;
  }
  &-canvas {
    flex: 1;
    overflow: auto;
  }
}
</style>
