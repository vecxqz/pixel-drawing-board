import { useStore } from "./useStore";

export function userPreview() {
  const store: any = useStore();
  function setCanvasPreview(canvasCtx: CanvasRenderingContext2D) {
    store.state.canvasModule.previewUrl = canvasCtx.canvas.toDataURL(
      "image/png",
      1
    );
  }

  return {
    setCanvasPreview
  };
}
