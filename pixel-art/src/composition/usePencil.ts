import { drawGrid } from "../util/canvas";
import { computed } from "vue";
import { useStore } from "./useStore";
export function usePencil(this: any) {
  const store: any = useStore();
  const canvasCtx = computed(() => store.state.canvasModule.canvasCtx);
  const shadowLayerCanvasCtx = computed(
    () => store.state.canvasModule.shadowLayerCanvasCtx
  );
  const color = computed(() => store.state.canvasModule.color);
  const size = computed(() => {
    return store.state.canvasModule.size;
  });
  const currentLayer = computed(
    () =>
      store.state.canvasModule.pages[store.state.canvasModule.currentPageIndex]
        .layers[store.state.canvasModule.currentLayerIndex]
  );

  function mouseDown(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    drawGrid(
      canvasCtx.value,
      currentLayer.value,
      columnIndex,
      rowIndex,
      color.value
    );
    store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
      columnIndex,
      rowIndex,
      data: {
        color: color.value
      }
    });
  }

  function mouseMove(this: any, e: MouseEvent) {
    const columnIndex = Math.floor(e.offsetX / size.value),
      rowIndex = Math.floor(e.offsetY / size.value);
    drawGrid(
      canvasCtx.value,
      currentLayer.value,
      columnIndex,
      rowIndex,
      color.value
    );
    store.dispatch("canvasModule/SET_LAYER_GRID_DATA", {
      columnIndex,
      rowIndex,
      data: {
        color: color.value
      }
    });
  }
  function mouseUp(this: any, e: MouseEvent) {
    console.log("pencil mouseUp");
  }
  return { mouseDown, mouseMove, mouseUp };
}
