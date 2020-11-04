import { bresenhamLineCircle, drawGrid, clearGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
export function useEraser(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex].layer
  );

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGrid(canvasCtx.value, currentLayer.value, columnIndex, rowIndex);
  }
  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGrid(canvasCtx.value, currentLayer.value, columnIndex, rowIndex);
  }
  function mouseUp(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGrid(canvasCtx.value, currentLayer.value, columnIndex, rowIndex);
  }

  return { mouseDown, mouseMove, mouseUp };
}
