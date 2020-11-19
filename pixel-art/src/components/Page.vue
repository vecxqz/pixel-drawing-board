<template>
  <div id="preview">
    <div class="preview-aniamtion">
      <div class="preview-title">
        <img src="../assets/preview.svg" />预览
        <input class="speed-control" type="text" v-model="speed" />ms
      </div>
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
        <div class="page-operate-item" @click="createPage(currentPageIndex)">
          新建图层
        </div>
        <div class="page-operate-item" @click="copyPage(currentPageIndex)">
          复制图层
        </div>
        <div class="page-operate-item" @click="deletePageA(currentPageIndex)">
          删除图层
        </div>
        <div
          class="page-operate-item"
          @click="movePage(currentPageIndex, 'left')"
        >
          左移图层
        </div>
        <div
          class="page-operate-item"
          @click="movePage(currentPageIndex, 'right')"
        >
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
import { useStore } from "../composables/useStore";
import { useDoState } from "../composables/useDoState";
import { useSelect } from "../composables/useSelect";
import { usePreview } from "../composables/usePreview";
import { ref, onMounted, watch } from "vue";
export default {
  name: "Page",
  setup() {
    const store: any = useStore();
    const { cancelSelect } = useSelect();
    const { mergeCanvas } = usePreview();
    const { toUndoStack, TYPE } = useDoState();
    const speed = ref(store.state.canvasModule.animationSpeed);
    watch(speed, newVal => {
      store.state.canvasModule.animationSpeed = +newVal;
    });
    const {
      pages,
      create,
      copy,
      deletePage,
      choose,
      animationPreviewUrl,
      currentPageIndex,
      move
    } = usePage();
    onMounted(() => {
      setAnimationPreview();
    });
    function createPage(index: number) {
      cancelSelect();
      mergeCanvas();
      const data: any = create(index);
      toUndoStack({ ...data, type: TYPE.PAGE_CREATE }, true);
    }
    function deletePageA(index: number) {
      cancelSelect();
      mergeCanvas();
      const data: any = deletePage(index);
      toUndoStack({ ...data, type: TYPE.PAGE_DELETE }, true);
    }
    function copyPage(index: number) {
      cancelSelect();
      mergeCanvas();
      const data: any = copy(index);
      toUndoStack({ ...data, type: TYPE.PAGE_COPY }, true);
    }
    function movePage(index: number, mode: string) {
      cancelSelect();
      mergeCanvas();
      if (mode === "left") {
        const data: any = move(index, mode);
        toUndoStack({ ...data, type: TYPE.PAGE_TO_LEFT }, true);
      }
      if (mode === "right") {
        const data: any = move(index, mode);
        toUndoStack({ ...data, type: TYPE.PAGE_TO_RIGHT }, true);
      }
    }
    function setAnimationPreview() {
      let index = 0;
      function animation() {
        if (index != store.state.canvasModule.pages.length - 1) {
          index += 1;
        } else {
          index = 0;
        }
        try {
          const { previewUrl } = store.state.canvasModule.pages[index];
          if (previewUrl) {
            animationPreviewUrl.value = previewUrl;
          }
        } catch (e) {
          // console.log(e);
          index = 0;
        }
        setTimeout(() => {
          animation();
        }, speed.value);
      }
      animation();
    }
    setAnimationPreview();
    return {
      pages,
      createPage,
      copyPage,
      deletePageA,
      choose,
      animationPreviewUrl,
      currentPageIndex,
      movePage,
      speed
    };
  }
};
</script>
<style lang="scss" scoped>
#preview {
  display: flex;
  flex: 1;
  max-height: 140px;
  padding: 4px 0 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  background-color: #333;
  color: #fff;
  font-size: 14px;
}
.preview-aniamtion {
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page-operate-group {
  display: flex;
  .page-operate-item {
    cursor: pointer;
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
  image-rendering: pixelated;
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
.speed-control {
  width: 40px;
  height: 18px;
}
</style>
