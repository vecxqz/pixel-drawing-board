<template>
  <ToolHeader />
  <div class="dis-flex area-mid">
    <ToolBar class="area-tool" />
    <PixleCanvas class="area-canvas" />
    <CanvasAttribute class="area-attribute" />
  </div>
  <Page class="page" />
</template>
<script>
import PixleCanvas from "@/components/Canvas.vue";
import ToolHeader from "@/components/ToolHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import CanvasAttribute from "@/components/CanvasAttribute.vue";
import Page from "@/components/Page.vue";
export default {
  components: {
    PixleCanvas,
    ToolBar,
    CanvasAttribute,
    ToolHeader,
    Page
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
    width: calc(100% - 330px);
    overflow: auto;
    position: relative;
    // align-items: center;
    // justify-content: center;
    // display: flex;
  }
}
.area-mid {
  flex: 1;
  height: calc(100% - 172px);
}
</style>
