import { useStore } from "./useStore";
import { computed } from "vue";

export function usePreview() {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const backgroundCanvasCtx = computed(
    () => store.state.canvasModule.backgroundCanvasCtx
  );
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

  function setCanvasPreview(
    canvasCtxs: Array<CanvasRenderingContext2D>,
    targetcanvasCtx: CanvasRenderingContext2D
  ) {
    // 这里将不同的canvas合到一个canvas上
    const { width, height, currentPageIndex } = store.state.canvasModule;
    for (let i = 0; i < canvasCtxs.length; i++) {
      const data = canvasCtxs[i].canvas;
      targetcanvasCtx.drawImage(data, 0, 0);
    }
    store.state.canvasModule.previewUrl = targetcanvasCtx.canvas.toDataURL(
      "image/png",
      1
    );
    store.state.canvasModule.pages[
      currentPageIndex
    ].previewUrl = targetcanvasCtx.canvas.toDataURL("image/png", 1);
  }

  function setCanvasPreviewByImageData(
    imageDatas: Array<any>,
    tempcanvasCtx: CanvasRenderingContext2D,
    targetcanvasCtx: CanvasRenderingContext2D
  ) {
    // 这里将不同的canvas合到一个canvas上
    const { width, height, currentPageIndex } = store.state.canvasModule;
    targetcanvasCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < imageDatas.length; i++) {
      const { imageData } = imageDatas[i];
      if (imageData) {
        tempcanvasCtx.putImageData(imageData, 0, 0);
        const { canvas } = tempcanvasCtx;
        targetcanvasCtx.drawImage(canvas, 0, 0);
      }
    }
    store.state.canvasModule.previewUrl = targetcanvasCtx.canvas.toDataURL(
      "image/png",
      1
    );
    store.state.canvasModule.pages[
      currentPageIndex
    ].previewUrl = targetcanvasCtx.canvas.toDataURL("image/png", 1);
  }

  function setPageImageData(
    imageDatas: Array<any>,
    tempcanvasCtx: CanvasRenderingContext2D,
    targetcanvasCtx: CanvasRenderingContext2D
  ) {
    // 这里将不同的canvas合到一个canvas上
    const { width, height, currentPageIndex } = store.state.canvasModule;
    targetcanvasCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < imageDatas.length; i++) {
      const { imageData } = imageDatas[i];
      if (imageData) {
        tempcanvasCtx.putImageData(imageData, 0, 0);
        const { canvas } = tempcanvasCtx;
        targetcanvasCtx.drawImage(canvas, 0, 0);
      }
    }
    store.state.canvasModule.pages[
      currentPageIndex
    ].imageData = targetcanvasCtx.getImageData(0, 0, width, height);
  }

  function mergeCanvas() {
    const { width, height } = store.state.canvasModule;
    store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].layers[
      store.state.canvasModule.currentLayerIndex
    ].imageData = canvasCtx.value.getImageData(0, 0, width, height);
    const backgroundMeta = {
      layerName: "background",
      imageData: backgroundCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const belowMeta = {
      layerName: "below",
      imageData: belowCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const aboveMeta = {
      layerName: "above",
      imageData: aboveCanvasCtx.value.getImageData(0, 0, width, height)
    };
    const currentMeta = {
      layerName: "current",
      imageData: canvasCtx.value.getImageData(0, 0, width, height)
    };
    const canvasArray = [backgroundMeta, belowMeta, currentMeta, aboveMeta];
    const pageImageArray = [belowMeta, currentMeta, aboveMeta];
    tempCanvasCtx.value.drawImage(belowCanvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.drawImage(canvasCtx.value.canvas, 0, 0);
    tempCanvasCtx.value.drawImage(aboveCanvasCtx.value.canvas, 0, 0);
    store.state.canvasModule.pages[
      store.state.canvasModule.currentPageIndex
    ].imageData = tempCanvasCtx.value.getImageData(0, 0, width, height);
    setCanvasPreviewByImageData(
      canvasArray,
      tempCanvasCtx.value,
      shadowCanvasCtx.value
    );
    setPageImageData(
      pageImageArray,
      tempCanvasCtx.value,
      shadowCanvasCtx.value
    );
  }

  return {
    setCanvasPreview,
    setPageImageData,
    setCanvasPreviewByImageData,
    mergeCanvas
  };
}
