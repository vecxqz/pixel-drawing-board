import { bresenhamLineCircle, clearGridB } from "../util/canvas";
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
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }
  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }
  function mouseUp(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }

  return { mouseDown, mouseMove, mouseUp };
}
