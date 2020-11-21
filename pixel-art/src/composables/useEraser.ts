import { bresenhamLineCircle, clearGridB } from "../utils/canvas";
import { computed } from "vue";
import { useWrapStore } from "../store/index";
export function useEraser() {
  const store = useWrapStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });

  function mouseDown(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }
  function mouseMove(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }
  function mouseUp(e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    clearGridB(canvasCtx.value, { columnIndex, rowIndex, size: 1 });
  }

  return { mouseDown, mouseMove, mouseUp };
}
