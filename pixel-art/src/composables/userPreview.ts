import { useStore } from "./useStore";

export function userPreview() {
  const store: any = useStore();
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
    for (let i = 0; i < imageDatas.length; i++) {
      const { canvasImageData } = imageDatas[i];
      if (canvasImageData) {
        tempcanvasCtx.putImageData(canvasImageData, 0, 0);
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

  return {
    setCanvasPreview,
    setCanvasPreviewByImageData
  };
}
