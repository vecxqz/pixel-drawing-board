<template>
  <ToolHeader id="toolHeader" />
  <div class="dis-flex area-mid">
    <ToolBar class="area-tool" />
    <PixleCanvas class="area-canvas" />
    <CanvasAttribute class="area-attribute" />
  </div>
  <Page class="page" id="pagePreview" />
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
#toolHeader {
  flex: 0 0 40px;
  height: 40px;
  color: #fff;
  background-color: #333;
}
.area-mid {
  flex: 1 1 auto;
  height: calc(100% - 180px);
}
#pagePreview {
  display: flex;
  flex: 0 0 140px;
  height: 140px;
  padding: 4px 0 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #333;
  color: #fff;
  font-size: 14px;
}
</style>
