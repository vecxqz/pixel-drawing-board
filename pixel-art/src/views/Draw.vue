<template>
  <ToolHeader />
  <div class="dis-flex">
    <ToolBar class="area-tool" />
    <PixleCanvas class="area-canvas" />
    <CanvasAttribute class="area-attribute" />
  </div>
  <AnimationPreview />
</template>
<script>
import PixleCanvas from "@/components/Canvas.vue";
import ToolHeader from "@/components/ToolHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import CanvasAttribute from "@/components/CanvasAttribute.vue";
import AnimationPreview from "@/components/AnimationPreview.vue";
export default {
  components: {
    PixleCanvas,
    ToolBar,
    CanvasAttribute,
    ToolHeader,
    AnimationPreview
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
