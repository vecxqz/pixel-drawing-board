import { computed, ref, nextTick } from "vue";
import { useWrapStore } from "../store/index";

export function useChoose() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const backgroundCanvasCtx = computed(
    () =>
      store.state.canvasModule.backgroundCanvasCtx as CanvasRenderingContext2D
  );
  const shadowCanvasCtx = computed(
    () =>
      store.state.canvasModule.shadowLayerCanvasCtx as CanvasRenderingContext2D
  );
  const tempCanvasCtx = computed(
    () => store.state.canvasModule.tempCanvasCtx as CanvasRenderingContext2D
  );
  const belowCanvasCtx = computed(
    () => store.state.canvasModule.belowCanvasCtx as CanvasRenderingContext2D
  );
  const aboveCanvasCtx = computed(
    () => store.state.canvasModule.aboveCanvasCtx as CanvasRenderingContext2D
  );
  const layers = computed(() => {
    if (
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
    ) {
      return store.state.canvasModule.pages[
        store.state.canvasModule.currentPageIndex
      ].layers;
    }
    return [];
  });

  function chooseLayer(index: number) {
    const {
      width,
      height,
      currentPageIndex,
      currentLayerIndex
    } = store.state.canvasModule;
    store.state.canvasModule.pages[currentPageIndex].layers[
      currentLayerIndex
    ].imageData = canvasCtx.value.getImageData(0, 0, width, height);
    canvasCtx.value.clearRect(0, 0, width, height);
    belowCanvasCtx.value.clearRect(0, 0, width, height);
    aboveCanvasCtx.value.clearRect(0, 0, width, height);
    store.state.canvasModule.currentLayerIndex = index;
    // 下标大于当前index的放到上层，下标小于当前inex的放到下层
    for (let i = 0; i < layers.value.length; i++) {
      const layer = layers.value[i];
      const { imageData, layerName } = layer;
      if (i < index) {
        console.log(`${layerName} 合到下层`);
        tempCanvasCtx.value.putImageData(imageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        belowCanvasCtx.value.drawImage(canvas, 0, 0);
      }
      if (i === index) {
        // 说明下层数据已合并完，清除临时层的画布内容，绘制上层数据
        // 如果该层存在数据，则把该层数据绘制到canvas上
        tempCanvasCtx.value.clearRect(0, 0, width, height);
        if (imageData) {
          canvasCtx.value.putImageData(imageData, 0, 0);
          // console.log(canvasCtx.value.canvas.toDataURL("image/png"));
        }
      }
      if (i > index) {
        console.log(`${layerName} 合到上层`);
        tempCanvasCtx.value.putImageData(imageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        // console.log(canvas.toDataURL("image/png"));
        aboveCanvasCtx.value.drawImage(canvas, 0, 0);
      }
    }
    tempCanvasCtx.value.clearRect(0, 0, width, height);
  }
  
  return {
    chooseLayer
  };
}
