import { computed, nextTick, ref, toRaw } from "vue";
import { useWrapStore } from "../store/index";
import cloneDeep from "lodash/cloneDeep";
import { initLayer } from "../utils/canvas";
import { usePreview } from "./usePreview";
import clone from "lodash/clone";
export function usePage() {
  const store = useWrapStore();
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
  const tempCanvasCtx = computed(() => store.state.canvasModule.tempCanvasCtx);
  const belowCanvasCtx = computed(
    () => store.state.canvasModule.belowCanvasCtx
  );
  const aboveCanvasCtx = computed(
    () => store.state.canvasModule.aboveCanvasCtx
  );
  const animationPreviewUrl = ref("");
  const { mergeCanvas } = usePreview();
  
  function create(index: number) {
    const imageData = tempCanvasCtx.value.createImageData(
      width.value,
      height.value
    );
    const layerMeta = {
      pageName: `page${currentPageIndex.value + 1}`,
      key: "0",
      previewUrl: "",
      imageData,
      width: width.value,
      height: height.value,
      layers: [
        {
          layerName: "layer0",
          key: "0",
          width: width.value,
          height: height.value,
          imageData: imageData
        }
      ]
    };
    (store.state.canvasModule.pages as Array<any>).splice(
      index + 1,
      0,
      layerMeta
    );
    store.state.canvasModule.currentPageIndex += 1;
    store.state.canvasModule.currentLayerIndex = 0;
    canvasCtx.value.clearRect(0, 0, width.value, height.value);
    mergeCanvas();
    return {
      currentPageIndex: store.state.canvasModule.currentPageIndex
    };
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
      const { imageData, layerName } = layer;
      if (i < mergIndex) {
        console.log(`${layerName} 合到下层`);
        tempCanvasCtx.value.putImageData(imageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        belowCanvasCtx.value.drawImage(canvas, 0, 0);
      }
      if (i === mergIndex) {
        // 说明下层数据已合并完，清除临时层的画布内容，绘制上层数据
        // 如果该层存在数据，则把该层数据绘制到canvas上
        tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
        if (imageData) {
          canvasCtx.value.putImageData(imageData, 0, 0);
        }
      }
      if (i > mergIndex) {
        console.log(`${layerName} 合到上层`);
        tempCanvasCtx.value.putImageData(imageData, 0, 0);
        const { canvas } = tempCanvasCtx.value;
        aboveCanvasCtx.value.drawImage(canvas, 0, 0);
      }
    }
    tempCanvasCtx.value.clearRect(0, 0, width.value, height.value);
  }

  function copy(index: number) {
    const page: page = cloneDeep(toRaw(store.state.canvasModule.pages[index]));
    store.state.canvasModule.pages.splice(index, 0, page);
    store.state.canvasModule.currentPageIndex = index + 1;
    return {
      currentPageIndex: store.state.canvasModule.currentPageIndex
    };
  }
  
  function deletePage(index: number) {
    const pageLength = store.state.canvasModule.pages.length;
    if (pageLength > 1) {
      const deleteData = store.state.canvasModule.pages[index];
      store.state.canvasModule.pages.splice(index, 1);
      if (index === pageLength - 1) {
        store.state.canvasModule.currentPageIndex -= 1;
        choose(store.state.canvasModule.currentPageIndex);
      }
      return {
        currentPageIndex: store.state.canvasModule.currentPageIndex + 1,
        currentPageData: deleteData
      };
    }
  }

  function createPageByData(data: any) {
    const { currentPageIndex, currentPageData } = data;
    // console.log(currentPageData);
    store.state.canvasModule.pages.splice(currentPageIndex, 0, currentPageData);
    choose(currentPageIndex);
    return {
      currentPageIndex
    };
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
    return {
      currentPageIndex: index + step,
      mode: mode
    };
  }

  return {
    pages,
    create,
    copy,
    deletePage,
    choose,
    animationPreviewUrl,
    currentPageIndex,
    move,
    createPageByData
  };
}
