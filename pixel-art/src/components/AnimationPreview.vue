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
import { computed, nextTick, onMounted, ref, toRaw } from "vue";
import cloneDeep from "lodash/cloneDeep";
import { useStore } from "../composables/useStore";
import { initLayer } from "../util/canvas";
import { userPreview } from "../composables/userPreview";
export default {
  name: "AnimationPreview",
  setup() {
    const store: any = useStore();
    const currentPageIndex = computed(
      () => store.state.canvasModule.currentPageIndex
    );
    // const currentLayerIndex = computed(
    //   () => store.state.canvasModule.currentLayerIndex
    // );
    const width = computed(() => store.state.canvasModule.width);
    const height = computed(() => store.state.canvasModule.height);
    const size = computed(() => store.state.canvasModule.size);
    const pages = computed(() => store.state.canvasModule.pages);
    const backgroundCanvasCtx = computed(
      () => store.state.canvasModule.backgroundCanvasCtx
    );
    const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
    const shadowCanvasCtx = computed(
      () => store.state.canvasModule.shadowLayerCanvasCtx
    );
    const belowCanvasCtx = computed(
      () => store.state.canvasModule.belowCanvasCtx
    );
    const aboveCanvasCtx = computed(
      () => store.state.canvasModule.aboveCanvasCtx
    );
    const tempCanvasCtx = computed(
      () => store.state.canvasModule.tempCanvasCtx
    );
    const animationPreviewUrl = ref("");
    const { setCanvasPreview } = userPreview();
    function create(index: number) {
      const layer: layer = initLayer(width.value, height.value, size.value);
      const layerMeta = {
        pageName: `page${currentPageIndex.value + 1}`,
        key: "0",
        previewUrl: "",
        layers: [
          {
            layer: layer,
            layerName: "layer0",
            key: "0"
          }
        ]
      };
      (store.state.canvasModule.pages as Array<any>).splice(
        index + 1,
        0,
        layerMeta
      );
      store.state.canvasModule.currentPageIndex += 1;
      canvasCtx.value.clearRect(0, 0, width.value, height.value);
      nextTick(() => {
        setCanvasPreview([backgroundCanvasCtx.value], shadowCanvasCtx.value);
      });
    }
    function choose(index: number) {
      store.state.canvasModule.currentPageIndex = index;
      store.state.canvasModule.currentLayerIndex = 0;
      const mergIndex = 0;
      const page = store.state.canvasModule.pages[index];
      const layers = page.layers;
      canvasCtx.value.clearRect(0, 0, width.value, height.value);
      belowCanvasCtx.value.clearRect(0, 0, width.value, height.value);
      aboveCanvasCtx.value.clearRect(0, 0, width.value, height.value);
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const { canvaImageData, layerName } = layer;
        if (i < mergIndex) {
          console.log(`${layerName} 合到下层`);
          tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
          const { canvas } = tempCanvasCtx.value;
          belowCanvasCtx.value.drawImage(canvas, 0, 0);
        }
        if (i === mergIndex) {
          // 说明下层数据已合并完，清除临时层的画布内容，绘制上层数据
          // 如果该层存在数据，则把该层数据绘制到canvas上
          tempCanvasCtx.value.clearRect(0, 0, width, height);
          if (canvaImageData) {
            canvasCtx.value.putImageData(canvaImageData, 0, 0);
          }
        }
        if (i > mergIndex) {
          console.log(`${layerName} 合到上层`);
          tempCanvasCtx.value.putImageData(canvaImageData, 0, 0);
          const { canvas } = tempCanvasCtx.value;
          aboveCanvasCtx.value.drawImage(canvas, 0, 0);
        }
      }
      tempCanvasCtx.value.clearRect(0, 0, width, height);
    }
    function copy(index: number) {
      const page: page = cloneDeep(
        toRaw(store.state.canvasModule.pages[index])
      );
      store.state.canvasModule.pages.push(page);
      store.state.canvasModule.currentPageIndex += 1;
    }
    function deletePage(index: number) {
      const pageLength = store.state.canvasModule.pages.length;
      if (pageLength > 1) {
        store.state.canvasModule.pages.splice(index, 1);
        if (index === pageLength - 1) {
          store.state.canvasModule.currentPageIndex -= 1;
          choose(store.state.canvasModule.currentPageIndex);
        }
      }
    }
    function move(index: number, mode: string) {
      interface step {
        [key: string]: any;
      }
      const getStep = (mode: string): number =>
        (({ right: 1, left: -1 } as step)[mode]);
      const step: number = getStep(mode);
      const pageLength = store.state.canvasModule.pages.length;
      if (index === 0 && step === -1) return;
      if (index === pageLength - 1 && step === 1) return;
      [
        store.state.canvasModule.pages[index],
        store.state.canvasModule.pages[index + step]
      ] = [
        store.state.canvasModule.pages[index + step],
        store.state.canvasModule.pages[index]
      ];
      choose(index + step);
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
          console.log(e);
          index = 0;
        }
        setTimeout(() => {
          animation();
        }, 16.66);
      }
      animation();
    }
    onMounted(() => {
      setAnimationPreview();
    });
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
