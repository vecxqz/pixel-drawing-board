<template>
  <div id="preview">
    <div class="preview-aniamtion">
      <div class="preview-title"><img src="../assets/preview.svg" />预览</div>
      <div class="page-preview-item">
        <img
          v-if="animationPreviewUrl"
          :src="animationPreviewUrl"
          alt=""
          class="page-preview-image animtionPreview"
        />
      </div>
    </div>
    <div class="preview-page">
      <div class="page-operate-group">
        <div class="page-operate-item" @click="create(currentPageIndex)">
          新建图层
        </div>
        <div class="page-operate-item" @click="copy(currentPageIndex)">
          复制图层
        </div>
        <div class="page-operate-item" @click="deletePage(currentPageIndex)">
          删除图层
        </div>
        <div class="page-operate-item" @click="move(currentPageIndex, 'left')">
          左移图层
        </div>
        <div class="page-operate-item" @click="move(currentPageIndex, 'right')">
          右移图层
        </div>
      </div>
      <div class="page-preview-group">
        <div
          class="page-preview-item"
          :class="{ highlight: currentPageIndex === index }"
          v-for="(page, index) in pages"
          :key="page.key"
          @click="choose(index)"
        >
          <img class="page-preview-image" :src="page.previewUrl" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePage } from "../composables/usePage";
export default {
  name: "Page",
  setup() {
    const {
      pages,
      create,
      copy,
      deletePage,
      choose,
      animationPreviewUrl,
      currentPageIndex,
      move,
    } = usePage();
    return {
      pages,
      create,
      copy,
      deletePage,
      choose,
      animationPreviewUrl,
      currentPageIndex,
      move
    };
  }
};
</script>
<style lang="scss" scoped>
#preview {
  display: flex;
  flex: 1;
  padding: 4px 0 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #333;
  color: #fff;
  font-size: 14px;
}
.preview-aniamtion {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-operate-group {
  display: flex;
  .page-operate-item {
    margin: 0 10px;
  }
}
// .page-preview-image {
//   margin: 10px 5px 0;
// }
.page-preview-group {
  display: flex;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 2px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #fff;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #741190;
  }
}
.page-preview-item {
  margin: 4px;
  display: flex;
}
.page-preview-image {
  width: 90px;
  height: 90px;
}
.preview-page {
  overflow: hidden;
}
.highlight {
  border: 3px solid rgb(230, 250, 49);
}
.preview-title {
  display: flex;
}
</style>
